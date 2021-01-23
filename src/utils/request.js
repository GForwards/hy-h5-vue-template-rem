/* 对axios根据业务需求再次封装 */
import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'
import Bridge from '@/utils/JsBridge'

const codeWhiteList = [
    2001,
    2003,
    3001,
    4011,
    4007,
    5004,
    4012,
    4013,
    4014,
    4015,
    4016,
    4017,
    6003,
    70001,
    70002,
] // 不需要弹窗的code错误码白名单

// 创建axios实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 30000,
})

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        if (store.getters.token !== null) {
            config.headers.token = store.getters.token
        }
        if (config.method === 'get') {
            config.url +=
                config.url.indexOf('?') === -1
                    ? `?timeNow=${new Date().getTime()}`
                    : `&timeNow=${new Date().getTime()}`
        }

        // 将设备信息放到请求头里面
        config.headers.terminal = store.getters.terminal
        config.headers.platform = 'h5-enterprise'

        return config
    },
    (error) => {
        // console.log('request-error:', error)
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        // 拦截文件流
        const headers = response.headers
        if (headers['content-type'] === 'application/octet-stream') {
            return response.data
        }
        const res = response.data

        if (res.code === 200) {
            // 响应成功
            return res.data
        } else {
            // 2004:  token 无效; 2005:  token 过期; 2008 token强制登出
            if (store.getters.device.includes('hydf')) {
                if (res.code === 2004 || res.code === 2005) {
                    console.log('loginInvalid')
                    Bridge.callHandler('loginInvalid')
                }
                if (res.code === 2008) {
                    // 强制登出
                    console.log('forceLoginInvalid')
                    Bridge.callHandler('forceLoginInvalid')
                }
                return Promise.reject(res)
            } else {
                // h5中
                if (codeWhiteList.includes(res.code)) {
                    return Promise.reject(res)
                } else {
                    /* 其他的情况 */
                    Toast({
                        message: res.msg || 'response error',
                        duration: 5 * 1000,
                    })
                    // router.push({ path: '/login' })
                    return Promise.reject(res)
                }
            }
        }
    },
    (error) => {
        // if (error.response.status > 500 && error.response.status < 506) {
        //   Toast('服务器错误')
        // } else {
        //   Toast(error.msg)
        // }
        if (process.env.NODE_ENV === 'development') {
            Toast(error.msg || '服务器开小差了...')
        } else {
            Toast('服务器开小差了...')
        }
        return Promise.reject(error)
    }
)

export default service
