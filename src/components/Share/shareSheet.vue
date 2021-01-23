<template>
    <div class="share-sheet">
        <div class="share-title">分享</div>
        <div class="share-list">
            <div class="share-list-item">
                <div class="svg-container">
                    <svg-icon icon-class="Share1"></svg-icon>
                </div>
                <div class="txt">微信好友</div>
            </div>
            <div class="share-list-item">
                <div class="svg-container">
                    <svg-icon icon-class="Share2"></svg-icon>
                </div>
                <div class="txt">朋友圈</div>
            </div>
            <div class="share-list-item">
                <div class="svg-container">
                    <svg-icon icon-class="Share3"></svg-icon>
                </div>
                <div class="txt">新浪微博</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ShareSheet',
    data() {
        return {}
    },
    components: {},
    mounted() {},
    methods: {},
}
</script>

<style lang="scss" scoped>
.share-sheet {
    padding: 16px 0;
    .share-title {
        font-size: 18px;
        line-height: 26px;
        color: rgba(0, 0, 0, 1);
        font-weight: bold;
        text-align: center;
        margin-bottom: 16px;
    }
    .share-list {
        @include flex-x-center;
        .share-list-item {
            width: 115px;
            .svg-container {
                font-size: 32px;
                margin-bottom: 12px;
                @include flex-x-center;
            }
            .txt {
                font-size: 12px;
                text-align: center;
            }
        }
    }
}
</style>
