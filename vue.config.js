'use strict'
const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const isProduction = process.env.NODE_ENV !== 'development' // 开发和测试环境一样的配置
const devNeedCdn = false // 本地是否需要注入cdn
function resolve(dir) {
    return path.join(__dirname, dir)
}

const cdn = {
    css: ['https://cdn.h5.hanyuan.vip/hy-wxH5/web/vant@2.9/lib/index.css'],
    js: [
        'https://cdn.h5.hanyuan.vip/hy-wxH5/web/vue.min.js',
        'https://cdn.h5.hanyuan.vip/hy-wxH5/web/vant@2.5/lib/vant.min.js',
        'https://cdn.h5.hanyuan.vip/hy-wxH5/web/vue-router.min.js',
        'https://cdn.h5.hanyuan.vip/hy-wxH5/web/axios.min.js',
        // 'https://cdn.h5.hanyuan.vip/hy-wxH5/web/vuex.min.js'
    ],
    // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
    externals: {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        vant: 'vant',
    },
}

// const name = defaultSettings.title || 'H5' // page title
const port = process.env.port || process.env.npm_config_port || 80
// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
    /**
     * You will need to set publicPath if you plan to deploy your site under a sub path,
     * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then publicPath should be set to "/bar/".
     * In most cases please use '/' !!!
     * Detail: https://cli.vuejs.org/config/#publicpath
     */

    publicPath: process.env.VUE_APP_BASE_URL,

    outputDir: 'dist',

    assetsDir: 'static',

    lintOnSave: process.env.NODE_ENV === 'development',

    productionSourceMap: false,

    css: {
        loaderOptions: {
            scss: {
                prependData: `@import "~@/styles/_variable.scss"; @import "~@/styles/_mixins.scss";`,
            },
        },
    },

    // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
    parallel: require('os').cpus().length > 1,

    devServer: {
        open: true,
        port: port,
        overlay: {
            warnings: true,
            errors: true,
        },
        proxy: {
            // change xxx-api/login => mock/login
            // detail: https://cli.vuejs.org/config/#devserver-proxy
            [process.env.VUE_APP_BASE_API]: {
                // target: `http://192.168.60.167:9000`, // 开发环境1
                target: `https://testnewapi.hanyuan.vip/`, // 测试
                // target: `https://prenewapi.hanyuan.vip`, // 预发布
                // target: `https://h5.hanyuan.vip`, // 生产
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: '',
                },
            },
        },
    },

    configureWebpack: (config) => {
        if (isProduction || this.devServer) {
            // 使用externals设置排除项
            config.externals = cdn.externals
        }
    },

    chainWebpack(config) {
        config.plugins.delete('preload') // TODO: need test
        config.plugins.delete('prefetch') // TODO: need test
        // 配置别名
        config.resolve.alias.set('@', resolve('src'))

        config.entry('index').add('babel-polyfill').end()

        // set svg-sprite-loader
        config.module.rule('svg').exclude.add(resolve('src/icons')).end()

        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]',
            })
            .end()

        // set preserveWhitespace
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap((options) => {
                options.compilerOptions.preserveWhitespace = true
                return options
            })
            .end()

        // 生产环境和测试环境注入cdn
        config.plugin('html').tap((args) => {
            if (isProduction || devNeedCdn) args[0].cdn = cdn
            return args
        })

        /* 开发环境 */
        config
            // https://webpack.js.org/configuration/devtool/#development
            .when(process.env.NODE_ENV === 'development', (config) =>
                config.devtool('cheap-source-map')
            )

        /* 非开发环境 */
        config.when(process.env.NODE_ENV !== 'development', (config) => {
            config
                .plugin('ScriptExtHtmlWebpackPlugin')
                .after('html')
                .use('script-ext-html-webpack-plugin', [
                    {
                        // `runtime` must same as runtimeChunk name. default is `runtime`
                        inline: /runtime\..*\.js$/,
                    },
                ])
                .end()
            config.optimization.splitChunks({
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        name(module) {
                            const packageName = module.context.match(
                                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                            )[1]
                            return `npm.${packageName.replace('@', '')}`
                        },
                        test: /[\\/]node_modules[\\/]/,
                        minChunks: 1,
                        maxInitialRequests: 5,
                        minSize: 0,
                        priority: 100,
                        chunks: 'initial', // only package third parties that are initially dependent
                    },
                    styles: {
                        name: 'styles',
                        test: /\.(sa|sc|c)ss$/,
                        chunks: 'all',
                        enforce: true,
                    },
                    vantUI: {
                        name: 'chunk-vantUI', // split vantUI into a single package
                        priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                        test: /[\\/]node_modules[\\/]_?vant(.*)/, // in order to adapt to cnpm
                    },
                    commons: {
                        name: 'chunk-commons',
                        test: resolve('src/components'), // can customize your rules
                        minChunks: 3, //  minimum common number
                        priority: 5,
                        reuseExistingChunk: true,
                    },
                },
            })

            config.optimization.runtimeChunk('single')
            config.optimization.minimize(true)

            // 文件压缩
            config.plugin('compressionPlugin').use(
                new CompressionPlugin({
                    test: /\.js$|\.html$|.\css/, // 匹配文件名
                    threshold: 10240, // 对超过10k的数据压缩
                    deleteOriginalAssets: false, // 不删除源文件
                })
            )
        })

        /* 生产环境 */
        config.when(process.env.NODE_ENV === 'production', (config) => {
            // 删除生产环境的console.log注释
            config.optimization.minimizer('terser').tap((args) => {
                args[0].terserOptions.compress.drop_console = true
                return args
            })
        })
    },
}
