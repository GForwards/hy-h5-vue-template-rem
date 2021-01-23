import Vue from 'vue'
import shareMask from './shareMask.vue'

export default class ShareMask {
    constructor() {
        this._instance = null
    }

    // 初始化
    static _init() {
        const shareMaskExtend = Vue.extend(shareMask)
        let instance = new shareMaskExtend()
        instance.vm = instance.$mount()
        this._instance = instance
        document.body.appendChild(instance.vm.$el)
    }

    // 展示遮罩
    static show() {
        this._instance.isGuideShow = true
    }

    // Vue.use调用
    // eslint-disable-next-line no-unused-vars
    static install(Vue, options) {
        this._init()
        Vue.prototype.$sharemask = ShareMask
    }
}
