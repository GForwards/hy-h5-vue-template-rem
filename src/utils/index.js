/*
 * @Author: Tommy·Yang
 * @Date: 2019-11-27 10:33:31
 * @Last Modified by: Tommy·Yang
 * @Last Modified time: 2021-01-23 13:18:11
 */

import router from '@/router'

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
            time = parseInt(time)
        }
        if (typeof time === 'number' && time.toString().length === 10) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay(),
    }
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        return value.toString().padStart(2, '0')
    })
    return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
    if (('' + time).length === 10) {
        time = parseInt(time) * 1000
    } else {
        time = +time
    }
    const d = new Date(time)
    const now = Date.now()

    const diff = (now - d) / 1000

    if (diff < 30) {
        return '刚刚'
    } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
        return '1天前'
    }
    if (option) {
        return parseTime(time, option)
    } else {
        return (
            d.getMonth() +
            1 +
            '月' +
            d.getDate() +
            '日' +
            d.getHours() +
            '时' +
            d.getMinutes() +
            '分'
        )
    }
}

/**
 * @param {string} url
 * @returns {Object} doNotDecode 默认需要解码
 */
export function getQueryObject({ url = null, query = { doNotDecode: false } }) {
    url = url == null ? window.location.href : url
    let { doNotDecode } = query
    const search = url.substring(url.lastIndexOf('?') + 1)
    const obj = {}
    const reg = /([^?&=]+)=([^?&=]*)/g
    search.replace(reg, (rs, $1, $2) => {
        const name = !doNotDecode ? decodeURIComponent($1) : $1
        let val = !doNotDecode ? decodeURIComponent($2) : $2
        val = String(val)
        obj[name] = val
        return rs
    })
    return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
    // returns the byte length of an utf8 string
    let s = str.length
    for (var i = str.length - 1; i >= 0; i--) {
        const code = str.charCodeAt(i)
        if (code > 0x7f && code <= 0x7ff) s++
        else if (code > 0x7ff && code <= 0xffff) s += 2
        if (code >= 0xdc00 && code <= 0xdfff) i--
    }
    return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
    const newArray = []
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i])
        }
    }
    return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
    if (!json) return ''
    return cleanArray(
        Object.keys(json).map((key) => {
            if (json[key] === undefined) return ''
            return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
        })
    ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
    const search = url.split('?')[1]
    if (!search) {
        return {}
    }
    return JSON.parse(
        '{"' +
            decodeURIComponent(search)
                .replace(/"/g, '\\"')
                .replace(/&/g, '","')
                .replace(/=/g, '":"')
                .replace(/\+/g, ' ') +
            '"}'
    )
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
    const div = document.createElement('div')
    div.innerHTML = val
    return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
    if (typeof target !== 'object') {
        target = {}
    }
    if (Array.isArray(source)) {
        return source.slice()
    }
    Object.keys(source).forEach((property) => {
        const sourceProperty = source[property]
        if (typeof sourceProperty === 'object') {
            target[property] = objectMerge(target[property], sourceProperty)
        } else {
            target[property] = sourceProperty
        }
    })
    return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
    if (!element || !className) {
        return
    }
    let classString = element.className
    const nameIndex = classString.indexOf(className)
    if (nameIndex === -1) {
        classString += '' + className
    } else {
        classString =
            classString.substr(0, nameIndex) +
            classString.substr(nameIndex + className.length)
    }
    element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
    if (type === 'start') {
        return new Date().getTime() - 3600 * 1000 * 24 * 90
    } else {
        return new Date(new Date().toDateString())
    }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
// export function debounce(func, wait, immediate) {
//     let timeout, args, context, timestamp, result

//     const later = function() {
//         // 据上一次触发时间间隔
//         const last = +new Date() - timestamp

//         // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
//         if (last < wait && last > 0) {
//             timeout = setTimeout(later, wait - last)
//         } else {
//             timeout = null
//             // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
//             if (!immediate) {
//                 result = func.apply(context, args)
//                 if (!timeout) context = args = null
//             }
//         }
//     }

//     return function(...args) {
//         context = this
//         timestamp = +new Date()
//         const callNow = immediate && !timeout
//         // 如果延时不存在，重新设定延时
//         if (!timeout) timeout = setTimeout(later, wait)
//         if (callNow) {
//             result = func.apply(context, args)
//             context = args = null
//         }

//         return result
//     }
// }

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'deepClone')
    }
    const targetObj = source.constructor === Array ? [] : {}
    Object.keys(source).forEach((keys) => {
        if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = deepClone(source[keys])
        } else {
            targetObj[keys] = source[keys]
        }
    })
    return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
    return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
    const timestamp = +new Date() + ''
    const randomNum = parseInt((1 + Math.random()) * 65536) + ''
    return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
    return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
        ele.className = ele.className.replace(reg, ' ')
    }
}

/**
 * @description 判断设备信息
 * @returns {String}
 */
export function judgeDevice() {
    const ua = window.navigator.userAgent

    if (ua.toLowerCase().includes('hydf')) {
        // app 端
        if (ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            // ios端
            return 'hydf-ios'
        } else if (ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1) {
            // android端
            return 'hydf-android'
        }
    } else {
        if (ua.toLocaleLowerCase().includes('micromessenger')) {
            // 微信浏览器
            return 'wx'
        } else {
            // 其他浏览器
            return 'others'
        }
    }
    /* if (!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
  // ios端
  console.log('ios端')
} else if (ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1) {
  // android端
  console.log('android端')
}
if (ua.toLocaleLowerCase().includes('micromessenger')) {
  // 微信浏览器
  console.log('微信浏览器')
} */
}

/**
 * @description 判断支付终端类型
 */
export function judegePayTerminalType() {
    const device = judgeDevice()
    switch (device) {
        case 'hydf-ios':
            return 'IOS'
        case 'hydf-android':
            return 'Android'
        case 'wx':
            return 'H5-wechat'
        default:
            return 'H5-browser'
    }
}

/**
 * @description 隐藏手机号中间几位
 * @param {String} phone 手机号
 *   @returns {String}
 */
export function noPassByMobile(phone) {
    if (phone) {
        const reg = /(\d{3})\d*(\d{4})/
        return phone.replace(reg, '$1****$2')
    } else {
        return ''
    }
}

/**
 * @description 把阿拉伯数字转换成汉字
 * @param {String} numberStr 数字字符串
 *   @returns {String}
 */
export function transNumToChinese(numberStr) {
    // eslint-disable-next-line no-constant-condition
    if (!/(^[1-9]\d*$)/) {
        return '非法数字'
    }
    let uppercase = '千百亿千百十万千百十个'
    const nLength = numberStr.length
    let newStr = ''
    if (uppercase.length - nLength < 0) {
        return '数字过长'
    }
    uppercase = uppercase.substr(uppercase.length - nLength)
    for (let i = 0; i < nLength; i++) {
        newStr +=
            '零一二三四五六七八九'.charAt(numberStr[i]) + uppercase.charAt(i)
    }
    newStr = newStr.substr(0, newStr.length - 1)
    return newStr
}

// 判断端终访问
export const browser = {
    versions: (function () {
        const u = navigator.userAgent
        return {
            trident: u.indexOf('Trident') > -1, // IE内核
            presto: u.indexOf('Presto') > -1, // opera内核
            webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, // android终端
            iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, // 是否iPad
            webApp: u.indexOf('Safari') == -1, // 是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, // 是否微信 （2015-01-22新增）
            qq: u.match(/\sQQ/i) == ' qq', // 是否QQ
        }
    })(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase(),
}

/* 移除html字符串上所有的样式 */
export function removeHtmlAllStyle(htmlStr) {
    return htmlStr
        ? htmlStr
              .replace(/[ \t]*style[ \t]*=[ \t]*("[^"]+")|('[^']+')/gi, '')
              .replace(
                  /[ \t]*width[ \t]*=[ \t]*("[^"]+")|('[^']+')/gi,
                  `width="100%"`
              )
              .replace(
                  /[ \t]*height[ \t]*=[ \t]*("[^"]+")|('[^']+')/gi,
                  `height="auto"`
              )
        : ''
}

/* Url相关方法 */
export class Url {
    /**
     * @description 根据传入的对象拼接参数
     * @param {Object} data
     */
    getParamUrl(data) {
        let url = ''
        for (const k in data) {
            const value = data[k] !== undefined ? data[k] : ''
            url += `&${k}=${value}`
        }
        return url ? url.substring(1) : ''
    }

    /**
     * @description 将url很参数进行拼接
     * @param {Object} data
     */
    getUrl(url, data) {
        if (data && Object.keys.length > 0) {
            // 看原来的url是否带？
            return (
                url + (url.includes('?') ? '&' : '?') + this.getParamUrl(data)
            )
        } else {
            return url
        }
    }
}

/**
 * Url相关方法
 * @param {*} options
 *
 */
export function setUrlQuery(options) {
    let { url, query } = options
    if (!url) return ''
    // 如果query重复就重新覆盖掉
    let params = getQueryObject({ url, query })
    let path = url.split('?')[0]
    query = Object.assign({}, params, query)

    if (query && Object.keys(query).length > 0) {
        let queryArr = []
        for (const key in query) {
            // eslint-disable-next-line no-prototype-builtins
            if (query.hasOwnProperty(key) && !!query[key]) {
                queryArr.push(`${key}=${query[key]}`)
            }
        }
        if (path.indexOf('?') !== -1) {
            path = `${path}&${queryArr.join('&')}`
        } else {
            path = `${path}?${queryArr.join('&')}`
        }
    }
    return path
}

/* 禁止页面返回 */
export function preventReback() {
    history.pushState(null, null, document.URL)
    window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL)
    })
}

/* 埋点事件 */
export function trackEvent(category, action, label, value) {
    const device = judgeDevice()
    let prefix
    switch (device) {
        case 'hydf-ios':
            prefix = 'Ios-'
            break
        case 'hydf-android':
            prefix = 'Android-'
            break
        default:
            prefix = ''
            break
    }
    if (window._czc) {
        // eslint-disable-next-line no-undef
        _czc.push([
            '_trackEvent',
            prefix + category,
            action,
            label || '',
            value || 0,
        ])
    }
}

export function isWifi() {
    try {
        let wifi = true
        const ua = window.navigator.userAgent
        const con = window.navigator.connection
        // 如果是微信
        if (/MicroMessenger/.test(ua)) {
            if (ua.indexOf('WIFI') >= 0) {
                return true
            } else {
                wifi = false
            }
            // 如果支持navigator.connection
        } else if (con) {
            const network = con.type
            if (
                network !== 'wifi' &&
                network !== '2' &&
                network !== 'unknown'
            ) {
                wifi = false
            }
        }
        return wifi
    } catch (e) {
        return false
    }
}

/**
 *判断是元素是否在可视区内
 * @export
 * @param {*} el
 * @returns
 */
export function isInViewPortOfTwo(el) {
    const viewPortHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
    const top = el.getBoundingClientRect() && el.getBoundingClientRect().top
    return top <= viewPortHeight
}

/**
 *函数节流
 * @export
 * @param {Function} callback 需要接口的方法
 * @param {Int} delay 延迟执行时间
 * @returns
 */
export function throttle(delay, callback) {
    let timeoutID
    let lastExec = 0

    function wrapper() {
        const self = this
        const elapsed = Number(new Date()) - lastExec
        const args = arguments

        function exec() {
            lastExec = Number(new Date())
            callback.apply(self, args)
        }

        clearTimeout(timeoutID)

        if (elapsed > delay) {
            exec()
        } else {
            timeoutID = setTimeout(exec, delay - elapsed)
        }
    }

    return wrapper
}

/**
 *函数防抖
 * @export
 * @param {Function} callback 需要接口的方法
 * @param {Int} delay 延迟执行时间
 * @returns
 */
export function debounce(callback, delay) {
    let timeout
    return function () {
        let context = this
        let args = arguments

        if (timeout) clearTimeout(timeout)

        timeout = setTimeout(() => {
            callback.apply(context, args)
        }, delay)
    }
}

/**
 * @description 获取百分比，主要用于图片
 * @export
 * @param {*} w 宽
 * @param {*} h 高
 * @returns 百分比
 */
export function getPercent(w, h) {
    let ratio = Math.floor((h / w) * 100)
    return ratio
}

// 浮点数加法运算
export function FloatAdd(a, b) {
    var c, d, e
    try {
        c = a.toString().split('.')[1].length
    } catch (f) {
        c = 0
    }
    try {
        d = b.toString().split('.')[1].length
    } catch (f) {
        d = 0
    }
  return e = Math.pow(10, Math.max(c, d)), (FloatMul(a, e) + FloatMul(b, e)) / e // eslint-disable-line
}

// 浮点数减法运算
export function FloatSub(a, b) {
    var c, d, e
    try {
        c = a.toString().split('.')[1].length
    } catch (f) {
        c = 0
    }
    try {
        d = b.toString().split('.')[1].length
    } catch (f) {
        d = 0
    }
  return e = Math.pow(10, Math.max(c, d)), (FloatMul(a, e) - FloatMul(b, e)) / e // eslint-disable-line
}

// 浮点数乘法运算
export function FloatMul(a, b) {
    var c = 0
    var d = a.toString()
    var e = b.toString()
    try {
        c += d.split('.')[1].length
        // eslint-disable-next-line no-empty
    } catch (f) {}
    try {
        c += e.split('.')[1].length
        // eslint-disable-next-line no-empty
    } catch (f) {}
    return (
        (Number(d.replace('.', '')) * Number(e.replace('.', ''))) /
        Math.pow(10, c)
    )
}

/**
 * 获取两个数值的小数点后面数字的长度
 *
 * @inner
 * @param {number} num1 第一个数值
 * @param {number} num2 第二个数值
 * @return {Array} 每个数值小数点后面数字的个数
 */
export function decimalLength(num1, num2) {
    var length1
    var length2
    try {
        length1 = num1.toString().split('.')[1].length
    } catch (e) {
        length1 = 0
    }
    try {
        length2 = num2.toString().split('.')[1].length
    } catch (e) {
        length2 = 0
    }
    return [length1, length2]
}

/**
 * 两个浮点数相除
 *
 * @public
 * @param {number} num1 第一个数值
 * @param {number} num2 第二个数值
 * @return {number} 相除的结果
 */
export function FloatDivide(num1, num2) {
    var result = decimalLength(num1, num2)
    var length1 = result[0]
    var length2 = result[1]
    // var maxLength = Math.max(length1, length2)
    var integer1 = +num1.toString().replace('.', '')
    var integer2 = +num2.toString().replace('.', '')
    // 默认保留小数点最长的个数
    return (integer1 / integer2) * Math.pow(10, length2 - length1)
}

/**
 * 保留小数
 * @param {*} x
 */
export function toDecimal(x, num = 100) {
    var f = parseFloat(x)
    if (isNaN(f)) {
        return
    }
    f = Math.ceil(x * num) / num
    return f
}

/**
 * location.replace的优化方法
 * @param {*} url 需要跳转的链接
 */
export function locationReplace(url, params = { query: {} }) {
    let { query } = params
    let testReg = /^http[s]{0,1}/
    let fullPath = setUrlQuery({ url, query: query || {} })
    if (testReg.test(fullPath)) {
        // 完整链接就用location.replace
        if (process.env.NODE_ENV === 'development') {
            location.replace(fullPath)
        } else {
            if (history.replaceState) {
                history.replaceState(null, document.title, fullPath)
                history.go(0)
            } else {
                location.replace(fullPath)
            }
        }
    } else {
        router.replace({
            path: url,
            query,
        })
    }
}

/**
 * 根据数组中的某个属性重新分组
 * @param {Array} arr 原始数组 一级
 * @param {String} key 根据key重新分组
 * @param {Array} mapKeys 一级数组需要返回的键
 */
export function arryGroupMatchByKey(arr, key, mapKeys = []) {
    let map = {},
        dest = []
    for (let i = 0; i < arr.length; i++) {
        let ai = arr[i]
        if (!map[ai[key]]) {
            let tmp = {
                [key]: ai[key],
                data: [ai],
            }
            mapKeys.forEach((keyItem) => {
                tmp[keyItem] = ai[keyItem]
            })
            dest.push(tmp)
            map[ai[key]] = ai
        } else {
            for (let j = 0; j < dest.length; j++) {
                let dj = dest[j]
                if (dj[key] == ai[key]) {
                    dj.data.push(ai)
                    break
                }
            }
        }
    }
    return dest
}
