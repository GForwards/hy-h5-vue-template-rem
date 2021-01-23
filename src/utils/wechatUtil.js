import wx from 'weixin-js-sdk'
import store from '@/store'
import router from '@/router'
import {
    getSignature,
    getWechatUserByCode,
    loginByWechatOpenId,
} from '@/api/weChat'
import { getUserInfo } from '@/api/user'
import { SET_OPENID, SET_TOKEN, SET_USERINFO } from '@/utils/constant'

export default {
    appid: process.env.VUE_APP_WECHAT_APPID, // process.env.VUE_APP_WECHAT_APPID,
    // appid: 'wx3b5e6070b4241088', // process.env.VUE_APP_WECHAT_APPID,

    /* 初始化wxjsdk各种接口 */
    init(apiList = []) {
        const device = store.getters.device
        if (device === 'wx') {
            // 需要使用的api列表
            console.log('获取签名', store.state.page.initLink)
            return new Promise((resolve, reject) => {
                getSignature(store.state.page.initLink)
                    .then((res) => {
                        console.log('获取微信签名', res)
                        if (res.appId) {
                            wx.config({
                                // debug: true,
                                appId: res.appId,
                                timestamp: res.timestamp,
                                nonceStr: res.nonceStr,
                                signature: res.signature,
                                jsApiList: apiList,
                            })
                            wx.ready((res) => {
                                // 微信SDK准备就绪后执行的回调。
                                resolve(wx, res)
                            })
                        } else {
                            reject(res)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
        }
    },
    getCode() {
        const code = location.href.split('?')[1]
        if (!code) return {}
        const obj = {}
        code.split('&').forEach((item) => {
            const arr = item.split('=')
            obj[arr[0]] = arr[1]
        })
        return obj
    },
    checkOpenIdByUserInfo() {
        return new Promise((resolve, reject) => {
            getUserInfo()
                .then((res) => {
                    let openId = res.wechatOpenId || null
                    if (openId === null) {
                        const code = this.getCode().code
                        // 否则就跳转微信的获取code过程
                        if (code) {
                            // code 存在就换取openId
                            getWechatUserByCode(code)
                                .then((codeData) => {
                                    openId = codeData.openId
                                    store.commit(`user/${SET_OPENID}`, openId)
                                    resolve(openId)
                                })
                                .catch((err) => {
                                    reject(err)
                                })
                        } else {
                            const redirectUrl = encodeURIComponent(
                                location.href
                            )
                            const link = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appid}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
                            window.location.href = link
                        }
                    } else {
                        store.commit(`user/${SET_OPENID}`, openId)
                        resolve(openId)
                    }
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },
    /**
     * @description 跟code换取openId
     */
    handleAuthorizeCode(callback) {
        const code = this.getCode().code
        console.log('code', code)
        let openId = store.getters.openId
        console.log('openId', openId)
        // 否则就跳转微信的获取code过程
        return new Promise((resolve, reject) => {
            if (code) {
                // code 存在就换取openId
                getWechatUserByCode(code)
                    .then((codeData) => {
                        openId = codeData.openId
                        store.commit(`user/${SET_OPENID}`, openId)
                        this.getUserInfoByOpenId(openId, callback)
                        resolve(openId)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            }
        })
    },
    /**
     * @description 微信授权登录-获取code
     */
    handleAuthorize() {
        return new Promise((resolve) => {
            let openId = store.getters.openId
            if (!openId) {
                const redirectUrl = encodeURIComponent(location.href)
                const link = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appid}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
                window.location.href = link
            } else {
                store.commit(`user/${SET_OPENID}`, openId)
                resolve(openId)
            }
        })
    },
    /* 通过openid判断用户绑定手机号以及用户是否绑定姓名 */
    getUserInfoByOpenId(openId, callback) {
        // const FORMORIGIN = localStorage.getItem('FORMORIGIN') // 获取存储来源地址
        loginByWechatOpenId(openId)
            .then((data) => {
                store.commit(`user/${SET_TOKEN}`, data.token)

                // 获取用户详情
                getUserInfo().then((userInfo) => {
                    // 存储用户详情
                    store.commit(`user/${SET_USERINFO}`, userInfo)
                    // 判断用户是否绑定手机号

                    if (userInfo.phone) {
                        callback && callback()
                        // 绑定了就跳到老用户登录页
                        // router.replace({ path: FORMORIGIN })
                        // window.location.href = FORMORIGIN
                    } else {
                        // 没绑定
                        router.push({
                            path: '/login',
                            query: {
                                from: 0,
                            }, // from = 0 表示来源于授权
                        })
                    }
                })
            })
            .catch((err) => {
                if (err.code === 2001) {
                    // 用户不存在 微信没有和手机号进行绑定 新用户
                    router.push({
                        path: '/login',
                        query: {
                            from: 0,
                        },
                    })
                }
            })
    },
}
