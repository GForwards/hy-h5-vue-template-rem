<template>
    <div class="aliplayer_box">
        <div
            class="player"
            :id="this.playerId"
            ref="player"
            :style="{
                height: `${100 / this.ratio}vw`,
            }"
        >
            <div class="loading" v-if="!over">
                <img src="~@/assets/img/loading.gif" alt="" />
            </div>
        </div>
    </div>
</template>

<script>
import { trackEvent } from '@/utils'
import { fullscreen } from '@/utils/appEvent'
import { mapGetters } from 'vuex'
import { fetchPlayAuth } from '@/api/study'
export default {
    props: {
        // 引入的aliplayer，默认是2.8.2版本的aliplayer
        jsPath: {
            type: String,
            default:
                'https://g.alicdn.com/de/prismplayer/2.8.2/aliplayer-min.js',
        },
        // 引入的aliplayer对应的H5播放器匹配的css，默认是2.8.2版本的aliplayer(注意需要和aliplayer版本一致)
        cssPath: {
            type: String,
            default:
                'https://g.alicdn.com/de/prismplayer/2.8.2/skins/default/aliplayer-min.css',
        },
        // 媒体转码服务的媒体Id。
        vid: String,
        // 	播放权证
        playauth: String,
        // 视频播放地址
        source: {
            type: String,
            default: '',
        },
        format: {
            type: String,
            default: 'mp4',
        },
        mediaType: {
            type: String,
            default: 'video',
        },
        // 视频封面
        cover: {
            type: String,
            default: '',
        },
        width: {
            type: String,
            default: '100vw',
        },
        // 播放器的宽高比，默认16：9
        ratio: {
            type: String,
            default: '1.78',
        },
        // 播放器自动循环播放
        rePlay: {
            type: Boolean,
            default: false,
        },
        // 默认使用h5播放器
        useH5Prism: {
            type: Boolean,
            default: true,
        },
        // 播放器是否自动播放，在移动端autoplay属性会失效。
        autoplay: {
            type: Boolean,
            default: false,
        },
        // H5是否内置播放，有的Android浏览器不起作用。
        playsinline: {
            type: Boolean,
            default: false,
        },
        // 视频埋点信息对象
        info: {
            type: Object,
            default() {
                return {
                    name: '', // 名称
                    source: '', // 页面来源
                }
            },
        },
        // 是否显示缓冲图，默认false
        showBuffer: {
            type: Boolean,
            default: false,
        },
        // 预加载
        preload: {
            type: Boolean,
            default: true,
        },
        // 默认清晰度
        defaultDefinition: {
            type: String,
            default: 'OD',
        },
        // 播放器默认样式
        skinLayout: {
            type: Array,
            default() {
                return [
                    {
                        name: 'bigPlayButton',
                        align: 'cc',
                        x: 0,
                        y: 0,
                    },
                    {
                        name: 'H5Loading',
                        align: 'cc',
                    },
                    {
                        name: 'errorDisplay',
                        align: 'tlabs',
                        x: 0,
                        y: 0,
                    },
                    {
                        name: 'infoDisplay',
                    },
                    {
                        name: 'tooltip',
                        align: 'blabs',
                        x: 0,
                        y: 56,
                    },
                    {
                        name: 'thumbnail',
                    },
                    {
                        name: 'controlBar',
                        align: 'blabs',
                        x: 0,
                        y: 0,
                        children: [
                            {
                                name: 'playButton',
                                align: 'tl',
                                x: 15,
                                y: 12,
                            },
                            {
                                name: 'progress',
                                align: 'blabs',
                                x: 0,
                                y: 44,
                            },
                            {
                                name: 'timeDisplay',
                                align: 'tl',
                                x: 10,
                                y: 5,
                            },
                            {
                                name: 'fullScreenButton',
                                align: 'tr',
                                x: 10,
                                y: 12,
                            },
                            // ,
                            // {
                            //   name: 'subtitle',
                            //   align: 'tr',
                            //   x: 15,
                            //   y: 12
                            // }
                            // ,
                            {
                                name: 'setting',
                                align: 'tr',
                                x: 15,
                                y: 12,
                            },
                            // {
                            //   name: 'volume',
                            //   align: 'tr',
                            //   x: 5,
                            //   y: 10
                            // }
                        ],
                    },
                ]
            },
        },
        controlBarVisibility: {
            type: String,
            default: 'click',
        },
        showBarTime: {
            type: String,
            default: '3000',
        },
    },
    data() {
        return {
            playerId: 'aliplayer' + Math.random() * 100000000000000000, // 保证播放器唯一性
            over: false, // 播放器加载完成
            inPlayer: null,
        }
    },
    computed: {
        ...mapGetters(['device']),
    },
    components: {},
    mounted() {
        this.lazyInit()
    },
    methods: {
        // 初始化，加载js和css
        lazyInit() {
            if (!window.Aliplayer) {
                // 尝试获取我们创建的js标签
                let inPlayerScriptTag = document.getElementById(
                    'inPlayerScriptTag'
                )
                if (!inPlayerScriptTag) {
                    // 这个标签不存在就创建
                    inPlayerScriptTag = document.createElement('script')
                    inPlayerScriptTag.type = 'text/javascript'
                    inPlayerScriptTag.src = this.jsPath
                    inPlayerScriptTag.id = 'inPlayerScriptTag'

                    // JS不存在也说明css也不存在，则创建Css标签
                    const inPlayerLinkTag = document.createElement('link')
                    inPlayerLinkTag.type = 'text/css'
                    inPlayerLinkTag.rel = 'stylesheet'
                    inPlayerLinkTag.href = this.cssPath

                    // 获取页面的<head>标签,将js和css插入到dom中
                    const head = document.getElementsByTagName('head')[0]
                    head.appendChild(inPlayerScriptTag)
                    head.appendChild(inPlayerLinkTag)

                    if (inPlayerScriptTag.loaded) {
                        // js插入并加载完成后初始化我们的播放器
                        this.initPlayer()
                    } else {
                        // 未加载完成就等待加载完成然后初始化我们的播放器
                        inPlayerScriptTag.addEventListener('load', () => {
                            this.initPlayer()
                        })
                    }
                }
            } else {
                // 全局实例存在
                // console.log('全局实例存在')
                this.initPlayer()
            }
        },
        // import { isWifi } from "@/utils/index";
        //     console.log(isWifi());
        // this.$toast(`iswifi=${isWifi()}`);
        // 播放器初始化
        initPlayer() {
            const playerHeight = 100 / this.ratio
            this.$nextTick(() => {
                // 判断播放器实例是否存在
                if (!this.inPlayer) {
                    let skinLayout
                    if (this.device.includes('android')) {
                        skinLayout = [
                            {
                                name: 'bigPlayButton',
                                align: 'cc',
                                x: 0,
                                y: 0,
                            },
                            {
                                name: 'H5Loading',
                                align: 'cc',
                            },
                            {
                                name: 'errorDisplay',
                                align: 'tlabs',
                                x: 0,
                                y: 0,
                            },
                            {
                                name: 'infoDisplay',
                            },
                            {
                                name: 'tooltip',
                                align: 'blabs',
                                x: 0,
                                y: 56,
                            },
                            {
                                name: 'thumbnail',
                            },
                            {
                                name: 'controlBar',
                                align: 'blabs',
                                x: 0,
                                y: 0,
                                children: [
                                    {
                                        name: 'playButton',
                                        align: 'tl',
                                        x: 15,
                                        y: 12,
                                    },
                                    {
                                        name: 'progress',
                                        align: 'blabs',
                                        x: 0,
                                        y: 44,
                                    },
                                    {
                                        name: 'timeDisplay',
                                        align: 'tl',
                                        x: 10,
                                        y: 5,
                                    },
                                    // {
                                    //     name: 'fullScreenButton',
                                    //     align: 'tr',
                                    //     x: 10,
                                    //     y: 12,
                                    // },
                                    // ,
                                    // {
                                    //   name: 'subtitle',
                                    //   align: 'tr',
                                    //   x: 15,
                                    //   y: 12
                                    // }
                                    // ,
                                    {
                                        name: 'setting',
                                        align: 'tr',
                                        x: 15,
                                        y: 12,
                                    },
                                    // {
                                    //   name: 'volume',
                                    //   align: 'tr',
                                    //   x: 5,
                                    //   y: 10
                                    // }
                                ],
                            },
                        ]
                    } else {
                        skinLayout = this.skinLayout
                    }
                    const obj = {
                        id: this.playerId,
                        userH5Prism: this.userH5Prism,
                        vid: this.vid,
                        playauth: this.playauth,
                        format: this.format,
                        mediaType: this.mediaType,
                        rePlay: this.rePlay,
                        autoplay: this.autoplay,
                        width: this.width,
                        heigth: `${playerHeight}vw`,
                        // source: this.source,
                        cover: this.cover,
                        skinLayout,
                        playsinline: this.playsinline,
                        showBuffer: this.showBuffer,
                        controlBarVisibility: this.controlBarVisibility,
                        showBarTime: this.showBarTime,
                        preload: this.preload,
                        defaultDefinition: this.defaultDefinition,
                    }
                    console.log(obj)
                    // eslint-disable-next-line
                    this.inPlayer = new Aliplayer(obj, (player) => {
                        // 初始化完成后手动设置封面
                        // const video = document
                        //     .querySelector('#' + this.playerId)
                        //     .querySelector('video')
                        // video.setAttribute('poster', this.cover)
                        // player.setCover(this.over)
                        let timer = setTimeout(() => {
                            this.over = true
                            clearTimeout(timer)
                            timer = null
                        }, 2000)

                        // 去除进度条拖动的图片图标
                        let cursorHover = document.querySelector(
                            '.prism-progress-cursor'
                        )
                        console.log(cursorHover)
                        cursorHover.innerHTML = ''
                    })
                    // let category
                    // if (this.info.source === 'videoDetail') {
                    //     // 案例详情
                    //     category = '案例视频'
                    // } else {
                    //     category = '视频详情'
                    // }
                    this.inPlayer.on('play', () => {
                        // 原生播放的时候监听有无网络
                        // this.$bridge.callHandler('videoStartPlay')

                        // trackEvent(category, '播放', this.info.name)
                        // console.log(this.inPlayer.getCurrentTime())
                        // console.log("click play...")
                        this.$emit('play')
                    })

                    this.inPlayer.on('pause', () => {
                        // console.log('pause')
                        // trackEvent(category, '暂停', this.info.name)
                        // console.log("click pause...")
                        this.$emit('pause')
                    })

                    this.inPlayer.on('requestFullScreen', () => {
                        // console.log('requestFullScreen')
                        // trackEvent(category, '全屏', this.info.name)
                        // console.log("click requestFullScreen...")
                        this.$emit('requestFullScreen')
                    })

                    this.inPlayer.on('ended', () => {
                        if (this.info.source === 'videoDetail') {
                            trackEvent('案例视频', '读完', this.info.name)
                        }
                        fetchPlayAuth(this.vid).then((newPlayauth) => {
                            this.inPlayer.replayByVidAndPlayAuth(
                                this.vid,
                                newPlayauth
                            )
                            console.log(newPlayauth)
                        })
                    })
                } else {
                    this.inPlayer.dispose()
                    // 将播放器实例重置
                    this.inPlayer = null
                    // 清空播放器的内容
                    document.getElementById(this.playerId).innerHTML = ''
                    // 再次初始化
                    this.initPlayer()
                }
            })
        },
        /* 获取视频当前播放时间 */
        getVideoCurrentTime() {
            if (this.inPlayer) {
                return this.inPlayer.getCurrentTime()
            }
        },
        /* 全屏事件 */
        fullscreen() {
            console.log('1111')
            fullscreen()
        },
    },
    beforeDestroy() {
        this.over = false
    },
}
</script>
<style lang="scss">
/* 阿里播放器样式 */
.aliplayer_box {
    .prism-player .prism-big-play-btn {
        width: 50px;
        height: 50px;
        background: url('~@/assets/img/icon_play.png') no-repeat;
        background-size: cover;
    }

    .prism-player .prism-big-play-btn .outter {
        display: none;
    }
    // 大播放按钮点击动画
    .prism-player .prism-animation {
        width: 50px;
        height: 50px;
        display: none !important;
    }
    .prism-player .prism-thumbnail {
        display: none !important;
    }
    // 进度条最底层背景
    .prism-player .prism-liveshift-progress,
    .prism-player .prism-progress {
        background: rgba(255, 255, 255, 0.4);
    }
    // 进度条播放中的背景
    .prism-player .prism-liveshift-progress .prism-progress-played,
    .prism-player .prism-progress .prism-progress-played {
        background-color: #efce90;
    }
    // 进度条预加载的背景
    .prism-player .prism-liveshift-progress .prism-progress-loaded,
    .prism-player .prism-progress .prism-progress-loaded {
        background: rgba(255, 255, 255, 0.8);
    }

    // 进度条高度
    .prism-player .prism-progress-hover {
        height: 4px;
    }

    // 进度条拖动图标
    .prism-player .prism-liveshift-progress .cursor-hover,
    .prism-player .prism-progress .cursor-hover {
        background: none;
        position: relative;
        background: none;
        top: -4px !important;
        height: 10;
        border-radius: 0;

        &::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            right: 2px;
            width: 5px;
            height: 10px;
            background: rgba(239, 206, 144, 1);
            border-radius: 4px;
        }
    }

    .prism-player .prism-liveshift-progress .prism-progress-cursor,
    .prism-player .prism-progress .prism-progress-cursor {
        overflow: auto;
        border-radius: 0;
    }

    // 播放小按钮
    .prism-player .prism-play-btn {
        width: 22px;
        height: 22px;
        background: url('~@/assets/img/icon_play_small.png') no-repeat;
        background-size: cover;
    }

    // 播放小暂停按钮
    .prism-player .prism-play-btn.playing {
        background: url('~@/assets/img/icon_pause_small.png') no-repeat;
        background-size: cover;
    }

    // 设置图标
    .prism-player .prism-setting-btn {
        width: 22px;
        height: 22px;
        background: url('~@/assets/img/icon_setting.png') no-repeat;
        background-size: cover;
    }

    // 全屏按钮
    .prism-player .prism-fullscreen-btn {
        width: 21px;
        height: 21px;
        background: url('~@/assets/img/icon_fullscreen.png') no-repeat;
        background-size: cover;
    }

    // 设置列表倍速、字幕、音轨
    .prism-setting-speed,
    .prism-setting-cc,
    .prism-setting-audio {
        display: none !important;
    }

    // 设置列表
    .prism-player .prism-setting-list {
        width: 120px;
        background: rgba(0, 0, 0, 0.7);
    }

    // 设置播放器清晰度列表
    .prism-player .prism-setting-selector {
        width: 120px;
        background: rgba(0, 0, 0, 0.7);
    }

    // 清晰度选中颜色
    .prism-player .prism-setting-selector ul li.current {
        color: rgba(239, 206, 144, 1);
    }

    // 清晰度选中箭头颜色
    .prism-player .prism-setting-selector ul li.current:before {
        border-left-color: rgba(239, 206, 144, 1);
    }

    // 清晰度头部
    .prism-player .prism-setting-selector .header {
        width: 120px;
        background: rgba(0, 0, 0, 0.7);
    }
    // tootip提示
    .prism-player .prism-tooltip {
        display: none !important;
    }

    // prism-info-display 清晰度切换提示
    .prism-player .prism-info-display {
        display: none !important;
    }
}
</style>
<style lang="scss" scoped>
.aliplayer_box {
    z-index: 100;
    position: relative;
    width: 100vw;
    background: black;
}
.loading {
    background: rgba(0, 0, 0, 1);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2000;
    img {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 40px;
        transform: translate(-50%, -50%);
    }
}
</style>
