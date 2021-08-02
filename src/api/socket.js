export default class websocketclass {
    constructor(url, msgCallback, time) {
        const ishttps = document.location.protocol.includes('https')
        const wsprotocol = ishttps ? 'wss://' : 'ws://'
        this.wsUrl = `${wsprotocol}${url}`
        this.msgCallback = msgCallback
        this.time = time //心跳时间
        this.initTime = 5000 //重连时间
        this.init()
    }
    init(data) {
        let wsinwin = 'WebSocket' in window
        if (!wsinwin) {
            return console.log('websocket not supported')
        }
        this.ws = new WebSocket(this.wsUrl)
        this.ws.onopen = () => {
            this.status = 'open';
            this.heartCheck();
            if (data) {
                this.ws.send(data)
            };
        }
        this.ws.onmessage = e => {
            if (e.data === 'pong') {
                this.pingPong = 'pong'
            } else {
                this.msgCallback(e.data)
            }
        }
        this.ws.onclose = (e) => {
            clearInterval(this.pingInterval)
            clearInterval(this.pongInterval)
            if (this.status === 'close') {
                // 手动关闭成功
            } else {
                // 非手动关闭,重连relink
                this.relink();
            }
        }
        this.ws.onerror = e => {
            console.log(e);
            this.relink()
        }
        return false
    }
    heartCheck() { //心跳
        this.pingPong = 'ping';
        let timer = this.time + 1000
        this.pingInterval = setInterval(() => {
            if (this.ws.readyState === 1) {
                this.ws.send('ping')
            }
        }, this.time);
        this.pongInterval = setInterval(() => {
            if (this.pingPong === 'ping') {
                // pong未返回,准备关闭
                clearInterval(this.pingInterval)
                clearInterval(this.pongInterval)
                this.ws.console()
            } else {
                this.pingPong = 'ping'
            }
        }, timer)
    }
    sendHandle(data) {
        return this.ws.send(data)
    }
    relink() {
        // 开始重连
        if (this.status == 'open' && this.readyState == 1) { //连接正常
            //状态正常,无需重新连接
            return
        }
        if (this.initTimeOut) { //定时器已经启动
            //正在重连,定时器已启动,退出
            return;
        }
        this.initTimeOut = setTimeout(() => {
            //重新连接 初始化
            clearInterval(this.pingInterval);
            clearInterval(this.pongInterval);
            this.initTimeOut = null;
            this.init();
        }, this.initTime)
    }
    // 手动关闭WebSocket
    closeMyself() {
        console.log('手动关闭');
        this.status = 'close';
        this.ws.close();
    }
}