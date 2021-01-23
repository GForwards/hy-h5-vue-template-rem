<template>
    <div class="img-text" v-html="imgTxtHtml"></div>
</template>

<script>
export default {
    /* 图文详情组件 */
    name: 'ImgText',
    props: {
        /* 富文本字符串 */
        html: {
            type: String,
            default: '',
        },
    },
    computed: {
        imgTxtHtml() {
            // return removeHtmlAllStyle(this.html)
            return this.html
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

<style lang="scss">
.img-text {
    width: 100%;
    overflow: hidden;
    padding: 0 0.15rem /* 15/100 */;
}
.img-text img {
    width: 100%;
    height: auto;
}
</style>
