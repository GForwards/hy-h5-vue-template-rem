<template>
    <van-overlay :show="isGuideShow" @click="isGuideShow = false">
        <div class="guide-wrapper">
            <img
                src="@/assets/img/guide_share_arrow.png"
                alt
                class="arrow-img"
            />
            <img
                src="@/assets/img/guide_share_text.png"
                alt
                class="arrow-text"
            />
        </div>
    </van-overlay>
</template>

<script>
import { Overlay } from 'vant'
export default {
    data() {
        return {
            isGuideShow: false,
        }
    },
    components: {
        VanOverlay: Overlay,
    },
    mounted() {},
    methods: {},
}
</script>

<style lang="scss" scoped>
.guide-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    .arrow-img {
        position: absolute;
        top: 0;
        right: 14px;
        width: 68px;
        height: 68px;
    }
    .arrow-text {
        position: absolute;
        top: 72px;
        right: 18px;
        width: 250px;
        height: 57px;
    }
}
</style>
