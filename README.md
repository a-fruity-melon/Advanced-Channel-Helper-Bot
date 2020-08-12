# Advanced Channel Helper Bot

Advanced Channel Helper Bot 是一个 Telegram Bot，用于给频道添加更强大的评论功能。Advanced Channel Helper Bot 的功能包括：在频道中创建评论区、收集用户评论和显示最近评论（支持渲染表情及图文混排）等。使用 Advanced Channel Helper Bot 能够为频道提供一个评论的平台，实现轻度的社交功能，有助于促进频道主与关注者、关注者和关注者之间直接的交流和沟通。

本项目在 Jogle Lew 的 Channel Helper Bot 上做出的最重要的修改即为支持渲染到图片，从而支持了表情的渲染和图文混排。其它修改包括了一些 bug fixes。

## 特性

### 简单的评论管理

在频道主发布了新的消息后，仅需要通过简单的操作即可呼出评论区。当频道消息对应的评论区出现在频道中时，关注者即可进行评论操作。

在自动模式下，频道主发布完消息后，无需任何操作，评论区会自动出现。

在手动模式下，频道主发布完消息后，仅需要以 `/command` 指令回复发布的消息，就可出现评论区。

### 方便的评论过程

每一个评论区都有两个按钮，“添加评论”和“显示所有评论”。点击按钮即自动跳转到 Channel Helper Bot 页面，按照提示进行操作即可完成评论和浏览。

在点击“添加评论”之后，即进入评论模式，向 bot 写下想说的话即可发布评论。如需退出评论模式，请使用 `/cancel` 命令。

在点击“显示所有评论”之后，bot 会在私聊页面显示一个可翻页的评论区，用户能够查看所有之前的评论信息（支持查看贴纸、图片、视频、文件等），管理员可以在这里进行删除消息、封禁用户的操作。

### 轻松的配置流程

配置过程十分简单，频道主只需几个步骤即可轻松完成 Channel Helper Bot 的配置。

1. 将 bot 添加为频道的管理员，同时 bot 需要足够的权限进行消息的发送和编辑。

2. 向 bot 私聊发送 `/register` 命令，按照 bot 的指示从频道中转发一条消息，用以记录频道的相关信息。

3. 发布一条消息看看吧！如果自动呼出评论区了则说明配置成功。（注：默认情况下 bot 为自动模式）

4. 如果您需要修改配置（模式、最近消息条数等），请向 bot 发送 `/option`命令，按照提示进行配置。

### 智慧的一物多用

Advanced Channel Helper Bot 并不满足于只服务一个频道。任何人都可以通过配置来添加和使用 Advanced Channel Helper Bot。同时 bot 本身也是开源的，您可以根据自己的需要另行部署。[@melon_channel_helper_bot](https://t.me/melon_channel_helper_bot) 是作者进行部署的最新版 Bot，欢迎使用。

## 部署

为了能运行 Advanced Channel Helper Bot，需要准备一个 Python 3 的环境，并需要使用 pip 安装相应的依赖。

### 安装依赖 

`pip3 install python-telegram-bot ninesix`

### 配置文件

请将 `helper_const.py.sample` 重命名为 `helper_const.py`，并填写其中的配置项目。

| 配置项目             | 类型          | 含义                                             
|----------------------|---------------|--------------------------------------------------
| BOT_TOKEN            | (str)         | Telegram Bot 的 token                            
| BOT_OWNER            | (list of int) | bot 管理员的 userID                              
| MIN_REFRESH_INTERVAL | (int)         | 最小刷新时间间隔，单位为秒                                 
| MODULE_NAME          | (list of str) | 启用的模块名称（如无特殊需求，则不需要更改这项） 
| DATABASE_DIR         | (str)         | 数据库存放位置                             
| FILES_GROUP          | (int)         | bot 用来预发送图片的群。建议新建一个包含 bot 的私密群。
------------------------------------------------------------------------------------------

### 修改权限

在注册完 bot 并获得 token 后，向 @BotFather 分别发送 `/setprivacy` 和 `/setinline` 来设置 bot 的权限。

### 配置 Headless Chrome

在 `./draw-comments` 中执行完 `yarn install` 后，将从网络上下载的 `chromium` 二进制文件放到特定目录下，并创建 `./draw-comments/config.js` 以指定该文件：

```js
module.exports = {
  CHROME_PATH: "path/to/executable"
};
```

P.S. 在 Ubuntu 上，你也可以使用 `sudo apt-get install chromium-browser` 来安装 `chromium`。使用 `which chromium` 来查看可执行文件的位置。

假如你没看懂，说明你不适合配置本 bot 的服务器端。（棒读

### 运行 bot 

`python3 helper_main.py`

`cd ./draw-comments && nohup node index.js 1 >> output.log 2>&1 &`

## 致谢

Advanced Channel Helper Bot 站在 [Channel Helper Bot](https://github.com/JogleLew/channel-helper-bot) 的肩膀上。

Channel Helper Bot 使用了 [python-telegram-bot](https://github.com/python-telegram-bot/python-telegram-bot) 的 Bot API。
