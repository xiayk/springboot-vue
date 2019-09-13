class Socket {
    constructor() {
        this.initWebSocket()
    }
    // 初始化weosocket
    initWebSocket() {
        // ws地址
        const wsuri = window.config.Host.websocket
        if ('WebSocket' in window) {
            this.websock = new WebSocket(wsuri)
            console.log(this.websock)
        } else {
            alert('Not support websocket')
        }
        window.websocketUserInfo = {
            XM: null
        }
        this.websock.onmessage = this.webSocketOnMessage
        this.websock.onclose = this.sendMessage
        this.websock.onerror = this.webSocketError
    }
    // 接收数据
    webSocketOnMessage(e) {
        // 打印接收到的数据 用于调试
        if (e.data.connector === 'getFileInfo') {
            console.log('---------> file info')
        } else {
            console.log(e.data)
        }
        const res = JSON.parse(e.data)
        if (res.connector === 'userLogin') {
            // 用户登陆后保存的用户信息
            window.websocketUserInfo = res.result
            // type 用于检测是否是第一次登陆 是就跳转页面
            window.websocketUserInfo.type = 1
            console.log('window.websocketUserInfo', window.websocketUserInfo)
        } else if (res.connector === 'getUserLogin') {
            // 获取登陆二维码数据 用于生成二维码
            window.websockQRCode = res
            console.log('window.websockQRCode', window.websockQRCode)
        } else if (res.connector === 'printerLogin') {
            // 终端打印机注册
            window.websockClientInfo = res
            console.log('window.websockClientInfo', window.websockClientInfo)
        } else if (res.connector === 'getFileInfo') {
            // 获取文件模板列表信息
            window.websockFileList = res
            console.log('window.websockFileList', window.websockFileList)
        } else if (res.connector === 'alipayMoney') {
            // 获取支付宝二维码
            window.AliPayCode = res
            console.log('获取支付宝二维码', window.AliPayCode)
        } else if (res.connector === 'getAdInfo') {
            // 获取轮播图列表
            window.shufflingList = res
            console.log('获取轮播图列表', window.shufflingList)
        } else if (res.connector === 'alipayMoneyBack') {
            // 获取支付回调
            window.alipayMoneyBack = res
            console.log('获取支付回调', window.alipayMoneyBack)
        } else if (res.connector === 'printTemplate') {
            // 获取文件预览数据
            window.printTemplateList = res
            console.log('文件预览数据', window.printTemplateList)
        }
    }
    // 发送数据 项目主要使用
    sendMessage(messageBady) { // 实际调用的方法
        window.websockMessageBady = messageBady
        // 若是ws开启状态
        if (this.websock.readyState === this.websock.OPEN) {
            this.websock.send(JSON.stringify(messageBady))
        } else if (this.websock.readyState === this.websock.CONNECTING) {
            // 若是 正在开启状态，则等待300毫秒
            // 保存当前对象this
            let that = this
            setTimeout(() => {
                that.websock.send(JSON.stringify(messageBady))
            }, 300)
        } else {
            // 若未开启 ，则等待500毫秒
            this.initWebSocket()
            let that = this
            // 保存当前对象this
            setTimeout(() => {
                // that.initWebSocket()
                that.websock.send(JSON.stringify(messageBady))
            }, 500)
        }
    }
    // 关闭websocket
    webSocketClose(e) {
        const that = this
        let errorTimer = setInterval(() => {
            that.initWebSocket()
            that.websock.send(JSON.stringify(window.websockMessageBady))
            if (that.websock.readyState === that.websock.CONNECTING) {
                window.clearInterval(errorTimer)
            }
        }, 500)
        console.log('connection closed (' + e.code + ')')
    }
    webSocketError(e) {
        console.log('connection error', e)
    }
}

export default new Socket()