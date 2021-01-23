<template>
    <div class="loading" v-if="show">
        <van-loading size="24px" vertical>加载中...</van-loading>
    </div>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {}
    },
    components: {},
    mounted() {},
    methods: {},
}
</script>

<style lang="scss" scoped>
.loading {
    @include flex-y-center;
    justify-content: center;
    height: 100%;
}
</style>
