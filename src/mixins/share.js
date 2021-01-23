import wechatUtil from '@/utils/wechatUtil'
import {
    canShare,
    registerGetUserInfo,
    callShare,
    hiddenAppShare,
} from '@/utils/appEvent'
import { mapMutations, mapGetters } from 'vuex'
export default {
    data() {
        return {
            shareMaskShow: false,
        }
    },
    computed: {
        ...mapGetters(['device']),
    },
    methods: {
        ...mapMutations({
            setShareInfo: 'share/setShareInfo',
        }),
        /* 分享方法 */
        share(shareData) {
            canShare(shareData)
            registerGetUserInfo(shareData)
            this.setShareInfo(shareData)
            this.wxShare(shareData)
        },
        /* callShare 唤起app分享或者微信分享 */
        callShare(shareData) {
            if (this.device.includes('hydf')) {
                callShare(shareData)
                return
            }

            // 非app中就唤起微信中的方法
            this.$sharemask.show()
        },
        /* 微信分享 */
        wxShare(shareData) {
            // f开头的是朋友圈分享的文案
            const {
                link,
                title,
                desc,
                imgUrl,
                flink = link,
                ftitle = title,
                fimgUrl = imgUrl,
            } = shareData
            wechatUtil
                .init([
                    'updateAppMessageShareData',
                    'onMenuShareAppMessage',
                    'onMenuShareTimeline',
                    'updateTimelineShareData',
                ])
                .then((wx) => {
                    // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
                    wx.updateAppMessageShareData({
                        title,
                        link,
                        imgUrl,
                        desc,
                        success: () => {
                            // this.$toast('分享成功')
                        },
                    })

                    // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
                    wx.updateTimelineShareData({
                        ftitle,
                        flink,
                        fimgUrl,
                        success: () => {
                            // this.$toast('分享成功')
                        },
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        /* 展示弹窗遮罩 */
        beforeRouteLeave(to, from, next) {
            // 如果有离开的函数就调用离开
            this.beforeRouteLeaveCb && this.beforeRouteLeaveCb()
            console.log('beforeRouteLeave')
            // 隐藏分享
            hiddenAppShare()
            next()
        },
    },
}
