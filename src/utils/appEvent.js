// ios和安卓 与h5的事件交互
import Bridge from '@/utils/JsBridge'
import { judgeDevice, Url, setUrlQuery, locationReplace } from '@/utils'
import router from '@/router'
import store from '@/store'
// 原生已注册handler事件
/*
   1. 跳转到下一页
   事件名：pushUrl
   参数名: url:String

   2. 打开某个页面
   事件名：openUrl
   参数名：url:String

   目前url支持: navigator://tab/<tabName>      tabName: home,course,study,discovery,me

   3. 跳转到下一页(弹起)
   事件名：presentUrl
   参数名: url:String

   4. 回到上一页
   事件名：pop
   参数名: 无

   5. 回到当前栈的第一页
   事件名：popRoot
   参数名: 无

   6. 刷新当前页
   事件名：refresh
   参数名: 无

   7. 登出
   事件名：logout
   参数名: 无

   8. 跳转内购页
   事件名：purchInApp
   参数名: 未定
   回调: 未定

*/
// import { pushUrl } from '@/utils/appEvent'

const device = judgeDevice()

// 跳到原生的一级页面，（home | 首页，study | 学习中心 ，course | 买课列表, '', url为映射的h5的路由路径
const firstTabList = [
    { tabName: 'home', url: '' },
    { tabName: 'course', url: '/course/list' },
    { tabName: 'study', url: '/learningcenter' },
    { tabName: 'discovery', url: '' },
    { tabName: 'me', url: '' },
]

/**
 * @description 路由push跳转
 * @param {*} url 路径
 * @param {*} query query参数
 * @param {*} cb 回调函数
 * @param {*} webOnly ture:纯web跳转 false:兼容app跳转
 */
export function pushUrl(url, params = { query: {}, cb: null, webOnly: false }) {
    let { webOnly, query, cb, animated = true } = params
    let baseUrl = process.env.VUE_APP_BASE_URL
    baseUrl = baseUrl.slice(0, baseUrl.length - 1)
    let testReg = /^http[s]{0,1}/
    let fullPath = setUrlQuery({ url, query: query || {} })
    if (!webOnly) {
        if (device.includes('hydf')) {
            // app中
            let url
            if (testReg.test(fullPath)) {
                url = fullPath
            } else {
                url = `${location.origin}${baseUrl}${fullPath}`
            }

            Bridge.callHandler('pushUrl', { url, animated }, (data) => {
                cb && cb(data)
            })
            return
        }
    }
    if (testReg.test(fullPath)) {
        window.location.href = fullPath
    } else {
        router.push({
            path: url,
            query,
        })
    }
}

/**
 * @description 路由back跳转
 * 作为app，需调用pop操作，作为web里，仍是pushurl操作
 * @param {*} path 路径
 * @param {*} query query参数
 * @param {*} cb 回调函数
 * @param {*} webOnly ture:纯web跳转 false:兼容app跳转
 */
export function backUrl(path, query, cb, webOnly = false) {
    const urlInstance = new Url()
    const fullPath = urlInstance.getUrl(path, query)
    if (!webOnly) {
        if (device.includes('hydf')) {
            // app中
            Bridge.callHandler(
                'pop',
                { url: `${location.origin}${fullPath}` },
                (data) => {
                    cb && cb(data)
                }
            )
            return
        }
    }
    router.push({
        path: fullPath,
    })
}

/**
 * @description 返回上一级
 * @param animated 退栈的动画 为false其实就删除当前栈的意思
 */
export function goBack(animated = true) {
    if (device.includes('hydf')) {
        Bridge.callHandler('pop', { animated })
    } else {
        router.go(-1)
    }
}

/**
 * @description 退栈删除栈操作
 * @param animated 退栈的动画
 * @param {*} webOnly ture:纯web跳转 false:兼容app跳转 true h5跳转
 * @param {*} backStep 需要往前删的栈的个数，默认删一层
 */
export function repalceUrl(
    url,
    params = { query: {}, cb: null, webOnly: false, backStep: null }
) {
    let { webOnly, cb, query, backStep, animated = true } = params
    let testReg = /^http[s]{0,1}/
    let fullPath = setUrlQuery({ url, query: query || {} })
    let baseUrl = process.env.VUE_APP_BASE_URL
    baseUrl = baseUrl.slice(0, baseUrl.length - 1)
    if (!webOnly) {
        if (device.includes('hydf')) {
            // app中
            let url
            if (testReg.test(fullPath)) {
                url = fullPath
            } else {
                url = `${location.origin}${baseUrl}${fullPath}`
            }
            Bridge.callHandler(
                'pushUrl',
                { url, backStep: backStep || 1, animated },
                (data) => {
                    cb && cb(data)
                }
            )
            return
        }
    }
    if (testReg.test(fullPath)) {
        locationReplace(fullPath)
    } else {
        router.replace({
            path: fullPath,
        })
    }
}

/**
 * @description 跳转到原生指定的一级页面
 * @param {*} tabName 页面名
 * @param {*} cb 原生成功的回调
 */
export function openUrl(tabName, cb) {
    const findItem = firstTabList.find((item) => item.tabName === tabName)
    if (device.includes('hydf')) {
        // app 中
        Bridge.callHandler(
            'openUrl',
            { url: `navigator://tab/${tabName}` },
            (data) => {
                cb && cb(data)
            }
        )
    } else {
        // 在h5中不存在就不用管
        if (!findItem) return // 不在列表中就不管
        router.push({ path: findItem.url })
    }
}

/**
 * @description 通知app该页面可以分享
 */
export function canShare(shareData, cb) {
    if (device.includes('hydf')) {
        // app 中
        Bridge.callHandler('appShare', shareData, (data) => {
            cb && cb(data)
        })
    }
}

/**
 * @description 通知app该页面隐藏分享
 */
export function hiddenAppShare(params, cb) {
    if (device.includes('hydf')) {
        // app 中
        Bridge.callHandler('hiddenAppShare', params, (data) => {
            cb && cb(data)
        })
    }
}

/**
 * @description 唤起app中的截屏
 */
export function screenshot() {
    if (device.includes('hydf')) {
        // app 中
        Bridge.callHandler('screenshot')
    }
}

/**
 * @description 本地注册给app用的事件，获取h5中的分享信息
 */
export function registerGetUserInfo() {
    if (device.includes('hydf')) {
        // app 中
        Bridge.registerHandler('getShareInfo', (data, responseCallback) => {
            responseCallback(store.getters.shareInfo)
        })
    }
}

/**
 * @description 调用app中的分享事件
 * @param {Object} params
 */
export function callShare(params, cb) {
    Bridge.callHandler('share', params, (data) => {
        cb && cb(data)
    })
}

/**
 * @description app中的登出事件
 * @param {Object} params
 */
export function callLogout() {
    Bridge.callHandler('logout')
}

/**
 * @description app中强制全屏（主要是安卓中）
 * @param {Object} params
 */
export function fullscreen() {
    if (device.includes('android')) {
        Bridge.callHandler('fullscreen')
    }
}

/**
 * 关闭当前页面
 * @export
 */
export function closePage() {
    if (device.includes('hydf')) {
        Bridge.callHandler('pop', { animated: false })
        return
    }
    const ua = window.navigator.userAgent
    if (ua.toLocaleLowerCase().includes('micromessenger')) {
        // 这个可以关闭安卓系统的手机
        document.addEventListener(
            'WeixinJSBridgeReady',
            function () {
                // eslint-disable-next-line
            if(WeixinJSBridge ){
                    // eslint-disable-next-line no-undef
                    WeixinJSBridge.call('closeWindow')
                }
            },
            false
        )
        // 这个可以关闭ios系统的手机
        // eslint-disable-next-line
    if(WeixinJSBridge ){
            // eslint-disable-next-line no-undef
            WeixinJSBridge.call('closeWindow')
        }
    } else {
        // window.opener = null;
        // window.open('', '_self', '');
        open(location, '_self').close()
    }
}

/**
 * 通知app端可以web后退
 * @param {Object} params {needback:true 需要一级一级返回 | false 一次性返回}
 * @export
 */
export function needWebpageBack(params = { needback: true }) {
    let { needback } = params
    Bridge.callHandler(
        'needWebpageBack',
        {
            needback: needback ? true : false,
        },
        (data) => {
            // eslint-disable-next-line no-undef
            cb && cb(data)
        }
    )
}

/**
 * h5注册返回事件给app端调用
 */
export function registerH5BackEvent() {
    if (device.includes('hydf')) {
        // app 中
        Bridge.registerHandler('routerback', () => {
            router.go(-1)
        })
    }
}

/**
 *  解除强制竖屏
 */
export function enableRotation(val) {
    if (device.includes('hydf')) {
        // app 中
        Bridge.callHandler('enableRotation', { enable: val }, () => {
            console.log('解除横屏成功')
        })
    }
}

/**
 * 跳转到app 创建企业页面
 * @param
 * @export
 */
export function goAppCreateEnterprise() {
    Bridge.callHandler('goAppCreateEnterprise')
}
