import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import createLoadingPlugin from '@/utils/vue-loading'
Vue.use(Vuex)

//  自动化引入modules下的所有js文件 https://webpack.docschina.org/guides/dependency-management/#require-context
const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    // 设置 user.js => user
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')

    // 将数据集成为  modules: {a: moduleA,b: moduleB}的格式
    const value = modulesFiles(modulePath)
    modules[moduleName] = value.default
    return modules
}, {})

export default new Vuex.Store({
    plugins: [createLoadingPlugin()],
    getters,
    modules,
})
