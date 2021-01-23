<template>
    <div id="app" v-wechat-title="title">
        <router-view />
    </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState({
            title: (state) => state.page.title,
        }),
    },
    components: {},
    created() {
        console.log('当前的域名--->', location.origin)
    },
    mounted() {
        // 增加站点统计功能
        // const script = document.createElement('script')
        // script.type = 'text/javascript'
        // script.innerText = `document.write(unescape("%3Cspan style='display:none;' id='cnzz_stat_icon_${process.env.VUE_APP_SITE_ID}'%3E%3C/span%3E%3Cscript src='https://v1.cnzz.com/z_stat.php%3Fid%3D${process.env.VUE_APP_SITE_ID}' type='text/javascript'%3E%3C/script%3E"));var _czc = _czc || [];_czc.push(["_setAccount", "${process.env.VUE_APP_SITE_ID}"]);`
        // document.body.appendChild(script)
    },
}
</script>

<style lang="scss">
@import '~@/styles/common.scss';
#app {
    font-family: 'Arial', 'Microsoft YaHei', '黑体', '宋体', sans-serif;
    min-height: 100vh;
    max-width: 750px;
    margin: 0 auto;
    background: #f3f5f9;
}
</style>
