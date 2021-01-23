import {
    getAppToken,
    setToken,
    removeToken,
    getCookieByKey,
} from '@/utils/auth'
import { getUserInfo } from '@/api/user'
import {
    OPENID,
    SET_OPENID,
    USER_TOKEN,
    EPINFO,
    SET_EPINFO,
    USERINFO,
    SET_USERINFO,
    SET_TOKEN,
} from '@/utils/constant'

const state = {
    token: null, // 权限验证
    openId: getCookieByKey(OPENID) || '',
    EnterpriseInfo: JSON.parse(localStorage.getItem(EPINFO)),
    UserInfo: JSON.parse(localStorage.getItem(USERINFO)),
}

const mutations = {
    [SET_TOKEN](state, token) {
        state.token = token
        setToken(USER_TOKEN, token)
    },
    [SET_EPINFO](state, EnterpriseInfo = {}) {
        state.EnterpriseInfo = { ...EnterpriseInfo }
        localStorage.setItem(EPINFO, JSON.stringify(EnterpriseInfo))
    },
    [SET_USERINFO](state, UserInfo = {}) {
        console.log(UserInfo, 'UserInfoUserInfo')
        state.UserInfo = Object.assign({}, state.UserInfo, UserInfo)
        localStorage.setItem(USERINFO, JSON.stringify(state.UserInfo))
    },
    [SET_OPENID](state, openId) {
        state.openId = openId
        setToken(OPENID, openId)
    },
}

const actions = {
    resetToken({ commit }) {
        return new Promise((resolve) => {
            commit(SET_TOKEN, '')
            removeToken(USER_TOKEN)
            resolve()
        })
    },
    /* 获取用户详情 */
    getUserInfo({ commit }) {
        getUserInfo()
            .then((res) => {
                console.log('userInfo', res)
                commit(SET_USERINFO, res)
            })
            .catch((err) => {
                console.log('获取用户详情失败', err)
            })
    },
    async setUserToken({ commit, state }) {
        if (!state.token) {
            const token = await getAppToken(USER_TOKEN)
            token ? commit(SET_TOKEN, token) : null
        }
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
}
