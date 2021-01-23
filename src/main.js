import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Bridge from './utils/JsBridge'
import filters from './filters'
import * as directives from './directives'
import onepx from './directives/onepx'
import VueLazyload from 'vue-lazyload'
import vueWechatTitle from 'vue-wechat-title'
import LoadingImg from '@/assets/img/lazyload_img_16x9.jpg'
import VueClipboard from 'vue-clipboard2'
import VConsole from 'vconsole'

import Vant, { Toast } from 'vant'
import 'vant/lib/index.css'

// import 'swiper/swiper-bundle.css'

import echarts from 'echarts' // echart图表

// svg icon
import '@/icons'

import '@/assets/css/normalize.css'

import './permission'

import shareMaskPlugin from './components/Share/shareMask.js'

// 引入Echars
Vue.prototype.$echarts = echarts

if (process.env.NODE_ENV === 'stage' || process.env.NODE_ENV === 'uat') {
    new VConsole() // 能够在vconsole中使用console.log打印 每次使用都需要重新实例化一次
}

// jsbridge和原生app交互
Vue.prototype.$bridge = Bridge

Vue.use(Vant)
Vue.use(Toast)

// 全局注册分享遮罩弹窗
Vue.use(shareMaskPlugin)

// 解决一像素问题
Vue.use(onepx)

// 图片懒加载
Vue.use(VueLazyload, {
    loading: LoadingImg,
    attempt: 1,
})

// 微信中动态更改title
Vue.use(vueWechatTitle)

// 粘贴板
VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard)

Object.keys(filters).forEach((item) => {
    Vue.filter(item, filters[item])
})

Object.keys(directives).forEach((item) => {
    Vue.directive(item, directives[item])
})

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app')
