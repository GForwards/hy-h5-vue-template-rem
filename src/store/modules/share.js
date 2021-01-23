/* 分享相关 */

const state = {
    shareInfo: {},
}

const mutations = {
    setShareInfo(state, shareInfo) {
        state.shareInfo = { ...shareInfo }
    },
}

const actions = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
}
