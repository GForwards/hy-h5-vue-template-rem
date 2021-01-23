<template>
    <div
        class="code"
        @touchstart="touchstart"
        @touchmove="touchmove"
        @touchend="touchend"
    >
        <img :src="url" alt="二维码" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { screenshot } from '@/utils/appEvent'
export default {
    props: {
        url: String,
    },
    computed: {
        ...mapGetters(['device']),
    },
    data() {
        return {
            timeOutEvent: null,
        }
    },
    components: {},
    mounted() {},
    methods: {
        touchstart() {
            // 清除定时器
            clearTimeout(this.timeOutEvent)
            this.timeOutEvent = setTimeout(() => {
                // 唤起截屏
                screenshot()
            }, 1000)
        },
        /* 如果手指移动就取消所有事件，此时用户只是移动不是长按 */
        touchmove() {
            clearTimeout(this.timeOutEvent)
            this.timeOutEvent = null
        },
        /* 结束后主动清除 */
        touchend() {
            clearTimeout(this.timeOutEvent)
            if (this.timeOutEvent !== null) {
                // 执行点击
            }
        },
    },
}
</script>

<style lang="scss">
img {
    width: 100%;
    height: auto;
}
</style>
