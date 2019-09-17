import { reject } from "q";
import axios from 'axios'

class HttpRequest {
    constructor(baseUrl = baseURL) {
        this.baseUrl = baseUrl
        this.queue = {}
    }
    getInsideConfig() {
        const config = {
            baseURL: this.baseUrl,
            headers: {
                "XWEB_TOKEN": window.sessionStorage.getItem("XWEB_TOKEN") || ""
            },
            method:"post"
        }
        return config
    }
    destroy(url) {
        delete this.queue[url]
        if (!Object.keys(this.queue).length) {
            // Spin.hide()
        }
    }
    interceptors(instance, url) {
        // 请求拦截
        instance.interceptors.request.use(config => {
            // 添加全局的loading...
            if (!Object.keys(this.queue).length) {
                // Spin.show() // 不建议开启，因为界面不友好
            }
            this.queue[url] = true
            return config
        }, error => {
            return Promise.reject(error)
        })
        // 响应拦截
        instance.interceptors.response.use(res => {
            this.destroy(url)
            const { data, status } = res;
            if(data.code == 200){
                return data;
            }else if(data.code == 401){
                window.sessionStorage.clear("XWEB_TOKEN");
                this.layui.use("layer", function(){
                    var layer = layui.layer;
                    layer.msg("HELLO")
                })
                this.$router.replace({name:"login"})
            }
            return { data, status }
        }, error => {
            this.destroy(url)
            let errorInfo = error.response
            // if (!errorInfo) {
            //     const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
            //     errorInfo = {
            //         statusText,
            //         status,
            //         request: { responseURL: config.url }
            //     }
            // }
            // addErrorLog(errorInfo)
            return Promise.reject(error)
        })
    }
    request(options) {
        const instance = axios.create()
        options = Object.assign(this.getInsideConfig(), options)
        this.interceptors(instance, options.url)
        return instance(options)
    }
}
export default HttpRequest
