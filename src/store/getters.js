const getters = {
    token: (state) => state.user.token,
    terminal: (state) => state.page.terminal,
    device: (state) => state.page.device,
    EnterpriseInfo: (state) => state.user.EnterpriseInfo,
    EnterpriseId: (state) => state.user.EnterpriseId,
    MyJobType: (state) => state.user.MyJobType,
    UserInfo: (state) => state.user.UserInfo,
    openId: (state) => state.user.openId,
    goUrl: (state) => state.page.goUrl,
}

export default getters
