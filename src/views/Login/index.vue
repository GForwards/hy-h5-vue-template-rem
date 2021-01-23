<template>
    <div class="login-contaniner">
        <Button @click="clickShare">点击分享</Button>
        <Button @click="authClick">点击按钮授权</Button>
        <div class="content">
            <div class="other-box">
                <div class="title">您好，</div>
                <div class="title-middle">欢迎来到汉源餐饮大学</div>
            </div>
            <div class="input-container">
                <div class="phone-box">
                    <input
                        type="number"
                        class="phone"
                        placeholder="请输入手机号"
                        v-model.trim="phoneNumber"
                        onkeyup="this.value= this.value.match(/\d+/) ? this.value.match(/\d+/)[0] : ''"
                        oninput="if (value.length > 11) value = value.slice(0, 11).replace(/[\D]/g, '')"
                        v-reset-page
                    />
                    <div
                        class="svg-container del-icon"
                        @click="delPhoneNum"
                        v-show="!!phoneNumber && phoneNumber.length > 0"
                    >
                        <img src="@/assets/img/login/icon/cancel.png" alt="" />
                        <!-- <svg-icon icon-class="del-btn"></svg-icon> -->
                    </div>
                </div>
                <div class="code-box">
                    <input
                        type="number"
                        class="code"
                        placeholder="请输入验证码"
                        v-model="code"
                        onkeyup="this.value= this.value.match(/\d+/) ? this.value.match(/\d+/)[0] : ''"
                        oninput="if (value.length > 6) value = value.slice(0, 6).replace(/[\D]/g, '')"
                        v-reset-page
                    />
                    <button
                        class="code-btn"
                        :class="[codeBtnActive ? 'normal' : 'disable']"
                        @click="getCode"
                        :disabled="!codeBtnActive"
                    >
                        {{ codeBtnText }}
                    </button>
                </div>
                <!-- <div class="input-tip" v-if="isTipShow">*{{ tipText }}</div> -->
            </div>
            <div class="login-btn-box">
                <button
                    class="login-btn"
                    @click="login"
                    :class="[loginBtnActive ? '' : 'inactive']"
                    :disabled="!loginBtnActive"
                >
                    登录
                </button>
            </div>
            <div class="tip">未注册的手机将自动登录</div>
        </div>
        <div class="footer">
            <div class="protocol-box" @click="gotoLink">
                登录表示您同意
                <a href="javasript:void(0)" class="hy-protocol"
                    >《汉源餐饮大学用户协议》</a
                >
            </div>
        </div>
    </div>
</template>

<script>
import { loginByPhone, sendPhoneVerifyCode } from '@/api/user'
import { mapMutations, mapGetters } from 'vuex'
import { trackEvent } from '@/utils'
import { SET_TOKEN } from '@/utils/constant'
import wechat from '@/utils/wechatUtil'

// 引入分享相关的插件
import shareMixin from '@/mixins/share'
/* *验证码有误，请重新输入
 *手机号格式不正确，请重新输入
 *手机号码不能为空 */
export default {
    name: 'Login',
    mixins: [shareMixin],
    data() {
        return {
            redirect: undefined,

            phoneNumber: '',
            code: '',
            codeBtnText: '获取验证码',
            isTipShow: false,
            tipText: '',
            isCodeBtnAble: true, // 获取验证码按钮可用
        }
    },
    computed: {
        ...mapGetters(['userInfo', 'device', 'openId']),
        // 发送验证码的激活状态
        codeBtnActive() {
            if (
                !!this.phoneNumber &&
                this.phoneNumber.length === 11 &&
                this.isCodeBtnAble
            ) {
                return true
            } else {
                return false
            }
        },
        // 登录按钮的激活状态
        loginBtnActive() {
            if (
                this.phoneNumber &&
                this.code &&
                this.phoneNumber.length === 11 &&
                this.code.length === 6
            ) {
                return true
            } else {
                return false
            }
        },
    },
    created() {
        // 这里是直接进来授权，不需要点击的时候
        // wechat.handleAuthorizeCode(() => {
        //     // 自己方法
        // })
    },
    methods: {
        ...mapMutations({
            setUserToken: 'user/' + SET_TOKEN,
        }),
        // 清空手机号输入框
        delPhoneNum() {
            if (this.phoneNumber === '') return
            this.phoneNumber = ''
        },
        // 获取验证码
        getCode() {
            this.isTipShow = false
            // 验证手机号是否符合规定
            // [23456789]
            if (!/\d{11}/.test(this.phoneNumber)) {
                // this.isTipShow = true
                // this.tipText = '手机号格式不正确，请重新输入'
                this.$toast('手机号格式不正确，请重新输入')
                return
            }
            if (!this.isCodeBtnAble) return
            this.isCodeBtnAble = false
            this.countDown()
            sendPhoneVerifyCode(this.phoneNumber)
                .then(() => {
                    this.$toast('发送成功')
                })
                .catch((err) => {
                    if (err.code === 2006) {
                        // this.isTipShow = true
                        // this.tipText = '请稍后发送，验证码发送太频繁'
                        this.$toast('请稍后发送，验证码发送太频繁')
                    }
                })
        },
        // 获取验证码倒计时
        countDown() {
            let totalTime = 60
            this.codeBtnText = `重新获取（${totalTime}S）`
            this.timer = setInterval(() => {
                if (totalTime > 0) {
                    totalTime--
                    this.codeBtnText = `重新获取（${totalTime}S）`
                } else {
                    this.codeBtnText = '获取验证码'
                    this.isCodeBtnAble = true
                    clearInterval(this.timer)
                    this.timer = null
                }
            }, 1000)
        },
        login() {
            const FORMORIGIN = localStorage.getItem('FORMORIGIN')
            this.isTipShow = false
            if (!/\d{11}/.test(this.phoneNumber)) {
                // this.isTipShow = true
                // this.tipText = '手机号格式不正确，请重新输入'
                this.$toast('手机号格式不正确，请重新输入')
                return
            }
            let params
            if (this.device === 'wx' && this.openId) {
                // 在微信中就传 头像等用户信息
                // const { username } = this.userInfo
                params = {
                    openId: this.openId,
                    phone: this.phoneNumber,
                    verifyCode: this.code,
                }
            } else {
                params = {
                    phone: this.phoneNumber,
                    verifyCode: this.code,
                }
            }
            loginByPhone(params)
                .then((data) => {
                    console.log(this.$router.history)
                    let { query } = this.$router.history.current
                    this.setUserToken(data.token)
                    // 跳转到存储的原来的url FORMORIGIN

                    if (Object.keys(query).length === 0) {
                        this.$router.replace({ path: this.redirect || '/' })
                    }
                    if (query.from.toString() === '0') {
                        this.$router.replace({ path: FORMORIGIN })
                    }
                })
                .catch((err) => {
                    this.isTipShow = false
                    if (err.code === 2003) {
                        this.$toast('验证码有误，请重新输入')
                    }
                })
        },
        gotoLink() {
            window.location.href = `${process.env.VUE_APP_H5}/protocol`
        },
        /* 唤起微信分享 */
        clickShare() {
            this.callShare({})
        },
        /* 点击按钮授权 */
        async authClick() {
            this.$toast.loading({
                message: '加载中...',
                forbidClick: true,
            })
            console.log('点击加入')
            localStorage.setItem('FORMORIGIN', this.$route.fullPath) // 获取存储来源地址
            try {
                const openId = await wechat.handleAuthorize()
                await wechat.getUserInfoByOpenId(openId, () => {
                    // 自己的方法
                })
            } catch (e) {
                console.log(e)
            }
        },
    },
    watch: {
        $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect
            },
            immediate: true,
        },
        phoneNumber() {
            this.isTipShow = false
            this.tipText = ''
        },
        code() {
            this.isTipShow = false
            this.tipText = ''
        },
    },
    beforeRouteEnter(to, from, next) {
        next(() => {
            // 增加埋点
            trackEvent('登录', '进入', '手机号注册')
        })
    },
}
</script>

<style lang="scss" scoped>
.login-contaniner {
    padding: 0 30px 0;
    height: auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: $white;
    .content {
        .wx-box {
            .header {
                @include flex-y-center;
                margin-top: 15px;
                margin-bottom: 20px;
                img {
                    width: 46px;
                    height: 46px;
                    border-radius: 100%;
                }
                .name {
                    color: rgba(0, 0, 0, 1);
                    line-height: 16px;
                    font-weight: bold;
                    margin-left: 10px;
                    font-size: 16px;
                }
            }
            .title {
                font-weight: bold;
                color: rgba(0, 0, 0, 1);
                line-height: 20px;
                margin-bottom: 20px;
                font-size: 20px;
            }
        }
        .other-box {
            margin-top: 72px;
            margin-bottom: 37px;
            .title {
                font-size: 26px;
                font-weight: 600;
                color: #333333;
                line-height: 42px;
            }
            .title-middle {
                font-size: 26px;
                font-weight: 600;
                color: #333333;
                line-height: 42px;
            }
        }
        .input-container {
            // box-shadow: 0px 12px 19px 0px rgba(60, 128, 209, 0.09);
            border-radius: 8px;
            margin-bottom: 40px;
            position: relative;
            // padding: 0 20px;
            input {
                height: 54px;
                // padding-left: 20px;
                border: 0;
                outline: none;
                background: rgba(0, 0, 0, 0);
                color: rgba(0, 0, 0, 1);
                font-size: 16px;
            }
            .phone-box {
                position: relative;
                padding-right: 35px;
                display: flex;
                border-bottom: 1px solid #f2f2f2;
                input {
                    flex: 1;
                }
                .del-icon {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    padding: 10px 0 10px 20px;
                    transform: translateY(-50%);
                }
            }
            .code-box {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #f2f2f2;
                margin-top: 8px;
                input {
                    width: 150px;
                }
                .code-btn {
                    display: block;
                    height: 40px;
                    font-size: 16px;
                    background: transparent;
                    white-space: nowrap;
                    &.normal {
                        color: #f89c5e;
                    }
                    &.disable {
                        color: #999999;
                    }
                }
            }
            .input-tip {
                position: absolute;
                left: 0;
                bottom: -27px;
                height: 17px;
                color: rgba(255, 65, 51, 1);
                line-height: 17px;
                font-size: 12px;
            }
        }
        .login-btn-box {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 12px;
            .login-btn {
                width: 315px;
                height: 48px;
                background: rgba(15, 37, 64, 1);
                border-radius: 100px;
                text-align: center;
                line-height: 48px;
                font-weight: 500;
                color: rgba(239, 206, 144, 1);
                font-size: 16px;
                &.inactive {
                    background: rgba(15, 37, 64, 0.5);
                    font-weight: 500;
                    color: #efce90;
                }
            }
        }
        .tip {
            // width: 154px;
            height: 21px;
            font-size: 14px;
            font-weight: 400;
            color: #b3b3b3;
            line-height: 21px;
        }
    }
    .footer {
        padding-bottom: 20px /* 40/100 */;
        .wx-login-box {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 35px;
            .wx-login-btn {
                width: 310px;
                height: 56px;
                border-radius: 10px;
                border: 1px solid rgba(15, 37, 64, 0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                .txt {
                    font-size: 16px;
                    color: rgba(15, 37, 64, 0.6);
                    margin-left: 10px;
                    font-weight: bold;
                }
            }
        }
        .protocol-box {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            font-weight: 400;
            line-height: 14px;
            color: rgba(153, 153, 153, 1);
            // margin-bottom: 10px;
            .hy-protocol {
                color: rgba(248, 156, 94, 1);
            }
        }
    }
}
</style>
