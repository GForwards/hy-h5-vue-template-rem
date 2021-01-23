import router from '@/router'
import store from '@/store'

// import defaultSettings from './settings'

// 白名单需要公用就抽离出来放在了settings文件中
// const whiteList = ['/login', '/wxlogin', '/invite/accept', '/studentlogin']

/**
 * 从其他项目来的公共参数
 * @param {*} to
 * @param {*} from
 */
function setOther(to) {
    let { goUrl } = to.query
    if (goUrl) {
        goUrl = decodeURIComponent(goUrl)
        store.commit('page/setGoUrl', goUrl)
    }
}

router.beforeEach(async (to, from, next) => {
    await store.dispatch('user/setUserToken')
    setOther(to, from)
    next()
})
