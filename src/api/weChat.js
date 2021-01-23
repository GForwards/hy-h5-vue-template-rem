/* 微信相关 */
import request from '@/utils/request'

/**
 * @description 根据url获取微信签名
 * @export
 * @param {*} url
 * @returns {Promise}
 */
export function getSignature(url) {
    return request({
        url: '/hy-resources/app/wechat/sign',
        method: 'get',
        params: { url },
    })
}

/**
 * @description 根据code换取openId和用户信息
 * @export
 * @param {*} code 微信登录code
 * @returns {Promise}
 */
export function getWechatUserByCode(wechatCode) {
    return request({
        url: `/hy-sys/app/getWechatUserByCode`,
        method: 'get',
        params: {
            wechatCode,
        },
    })
}

/**
 * @description loginByWechatOpenId 使用微信OpenId登录
 * @export
 * @param {*} phone
 * @returns
 */
export function loginByWechatOpenId(wechatOpenId) {
    return request({
        url: '/hy-sys/app/loginByWechatOpenId',
        method: 'get',
        params: {
            wechatOpenId,
        },
    })
}
