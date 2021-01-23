/* 用户验证相关 */
import Cookies from 'js-cookie'
import Bridge from '@/utils/JsBridge'
import { judgeDevice } from '@/utils'

export function getCookieByKey(Key) {
    return Cookies.get(Key)
}
// ios 新包新增逻辑 提供getUserToken方法
export const getAppToken = (TokenKey) => {
    return new Promise((resolve) => {
        const device = judgeDevice()
        let token = Cookies.get(TokenKey)
        if (device.includes('hydf-ios') && !token) {
            Bridge.callHandler('getUserToken', {}, (data) => {
                console.log(data)
                if (data) {
                    token = data.token
                    resolve(token)
                } else {
                    console.log('get ios token err', data)
                }
            })
        } else {
            resolve(token)
        }
    })
}

export function setToken(TokenKey, token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken(TokenKey) {
    return Cookies.remove(TokenKey)
}
