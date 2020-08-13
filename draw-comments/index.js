// @ts-check
const config = require("./config");
const path = require("path");
const { randomBytes } = require("crypto");

const puppeteer = require("puppeteer-core");

const express = require("express");
const app = express();

const PORT = 6899;
console.log("[PID]", process.pid);

/**
 * @type {puppeteer.Browser}
 */
let browser;

/**
 * @type {puppeteer.Page}
 */
let page;

let pageLoaded = false;

async function initBrowser() {
  if(browser) {
    await browser.close();
  }
  browser = await puppeteer.launch({
    executablePath: config.CHROME_PATH,
    headless: !process.argv.includes("--debug"),
  });
  page = (await browser.pages())[0];
  const oldPage = page;
  page = await browser.newPage();
  await oldPage.close();
  await page.setViewport({
    width: 1024,
    height: 768,
    deviceScaleFactor: 4,
  });
  await page.goto(`file:///${__dirname}/comments.html`, {
    timeout: 5000,
  }).catch(() => {
    pageLoaded = false;
    initBrowser();
  });
  while(!await page.evaluate("window.loaded")) {
    await sleep(500);
  }
  pageLoaded = true;
  page.on("close", () => {
    pageLoaded = false;
    initBrowser();
  });
  setTimeout(() => {
    pageLoaded = false;
    initBrowser();
  }, 30 * 60 * 1e3);
  console.log("Browser loaded.");
}

function initServer() {
  app.get("/render/:comments", async (req, res) => {
    while(!pageLoaded) {
      await sleep(100);
    }
    /**
     * @type {{
      timeStr: string;
      name: string;
      uid: string;
      type: "text" | "image";
      content: string;
      url?: string;
      replyTo?: string;
     }[]}
     */
    const comments = JSON.parse(req.params.comments);
    const sessionId = await page.evaluate("createSession()");
    for(const comment of comments) {
      const flag = randomBytes(8).toString("hex");
      const result = await page.evaluate(`createComment(
        "${sessionId}",
        ${Date.parse(comment.timeStr + " GMT") || Date.now()},
        "${encodeURIComponent(comment.name)}",
        "${encodeURIComponent(comment.replyTo) || ""}",
        "${comment.uid}",
        "${comment.type}",
        "${encodeURIComponent(comment.content)}",
        "${comment.url || ""}",
        "${flag}"
      );`);
      if(result) {
        if(comment.type === "image") {
          let totalSleep = 0;
          while(!await page.evaluate(`window.images["${flag}"]`)) {
            await sleep(500);
            totalSleep += 500;
            if(totalSleep > 4000) break;
          }
        }
      }
    }
    await page.evaluate(`afterComment("${sessionId}");`);
    const sessionNode = (await page.$$("#session-" + sessionId))[0];
    const imagePath = path.join(__dirname, "screenshots", sessionId + ".png");
    const sessionHeight = Math.ceil((await sessionNode.boundingBox()).height);
    await page.setViewport({
      width: 1024,
      height: sessionHeight,
      deviceScaleFactor: 4,
    });
    await sessionNode.screenshot({
      encoding: "binary",
      type: "png",
      path: imagePath,
    });
    res.send({path: imagePath});
    res.end();
    await page.evaluate(`removeSession("${sessionId}");`);
  });
  app.listen(PORT, () => console.log("app listening on", PORT));
}

/**
 * @param {number} ms
 */
function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}


initBrowser().then(initServer);
