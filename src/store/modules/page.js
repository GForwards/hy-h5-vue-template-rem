import { judgeDevice, judegePayTerminalType } from '@/utils'
import { GOURL } from '@/utils/constant'
const state = {
    device: judgeDevice(), // 判断h5所在设备
    weCharUrl: [], // 已通过wx.config注册过的url
    title: '汉源餐饮大学', // 页面标题
    initLink: '',
    terminal: judegePayTerminalType(), // 支付的终端类型
    goUrl: localStorage.getItem(GOURL) || '',
}

const mutations = {
    setWeChatUrl(state, url) {
        state.weCharUrl.push(url)
    },
    setTitle(state, title) {
        state.title = title
    },
    setInitLink(state, initLink) {
        state.initLink = initLink
    },
    setGoUrl(state, url) {
        state.goUrl = url
        localStorage.setItem(GOURL, url)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
}
