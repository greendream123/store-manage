const wsCommandSetRole     = "setRole"     // 设置身份 {"type":"","name":""}
const wsCommandSubscribe   = "subscribe"   // 订阅频道 ["channel1", "channel2"] 或 "channel"
const wsCommandUnsubscribe = "unsubscribe" // 解除订阅频道 同订阅
const wsCommandReady       = "ready"       // 客户端告诉服务器“我可以开始接收消息了”

// 简单的基于 websocket 的MQ，用来接收服务器实时通知
export const WebSocketMQ = class {
  init(url, role, channels) {
    this.url = url
    this.channels = channels
    this.exiting = false
    this.initSocket()
  }

  close() {
    this.exiting = true
    this.ws.close()
  }

  // 创建连接
  initSocket() {
    this.ws = new WebSocket(this.url)
    this.ws.onmessage = this.onMessage
    this.ws.onopen = this.onOpen
    this.ws.onerror = this.onError
    this.ws.onclose = this.onClose
    this.ws.client = this // 把当前客户端记到 websocket 上下文
  }

  initClient() {
    this.sendCommand(wsCommandSetRole, this.role)
    this.doSubscribe()
    this.sendCommand(wsCommandReady)
  }

  sendCommand(cmd, content) {
    let command = {command: cmd}
    if (content) {
      command.content = content
    }
    this.ws.send(JSON.stringify(command))
  }

  doSubscribe() {
    let channels = []
    for (let channel in this.channels) {
      channels.push(channel)
    }
    if (channels.length > 0) {
      this.sendCommand(wsCommandSubscribe, channels)
    }
  }

  onMessage(message) {
    let data = JSON.parse(message.data)
    let channel = data.channel
    let content = data.message
    let cb = this.client.channels[channel]
    if (cb) {
      cb(content)
    } else {
      console.log('channel ' + channel + ' not subscribed')
    }
  }

  onOpen() { // 连接成功就初始化客户端
    this.client.initClient()
  }

  onError() { }

  onClose() { // 关闭5秒后重连
    let that = this
    if (!that.client.exiting) {
      setTimeout(function() {
        that.client.initSocket()
      }, 5000)
    }
  }
}
