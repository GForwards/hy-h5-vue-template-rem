import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
    /**
     * EnterpriseArea 默认首页
     */
    {
        path: '/',
        name: 'Login',
        component: () => import('@/views/Login/index'),
    },
    { path: '*', redirect: '/404', hidden: true },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.VUE_APP_BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes,
})

router.afterEach(async (to) => {
    store.commit('page/setTitle', to.meta.title)
    let url = window.location.href.split('#')[0]
    store.commit('page/setInitLink', url)
})

export default router
