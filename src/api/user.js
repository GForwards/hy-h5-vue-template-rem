/* 用户相关 */
import request from '@/utils/request'

/**
 * @export
 * @param {*}
 * @returns
 */
export function test() {
    return request({
        url: '/test',
        method: 'get',
    })
}

/**
 * @description 手机验证码登录
 * @export
 * @param {*} data
 * @returns
 */
export function loginByPhone(data) {
    return request({
        url: '/hy-sys/app/loginByPhone',
        method: 'post',
        data,
    })
}

/**
 * @description 发送手机短信验证码
 * @export
 * @param {*} phone
 * @returns
 */
export function sendPhoneVerifyCode(phone) {
    return request({
        url: '/hy-sys/app/sendPhoneVerifyCode',
        method: 'get',
        params: {
            phone,
        },
    })
}

/**
 * @description updateUsername 修改用户姓名
 * @export
 * @param {*} userName 用户姓名
 * @returns
 */
export function updateUsername(userName) {
    return request({
        url: '/hy-user/app/user/updateUserName',
        method: 'post',
        data: {
            userName,
        },
    })
}

/**
 * @description fetchUserInfo 查询用户企业详情
 * @export
 * @returns
 */
export function fetchUserInfo() {
    return request({
        url: '/app/enterprise/userEnterpriseDetails',
        method: 'get',
    })
}

export function logout() {
    return request({
        url: '/user/logout',
        method: 'post',
    })
}

/**
 * @description getUserInfo 查询用户详情
 * @export
 * @returns
 */
export function getUserInfo() {
    return request({
        url: '/hy-user/app/user/detail',
        method: 'get',
    })
}
