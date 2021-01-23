/**
 * @description fitIphoneX 主要是为了适配iphoneX自适配的问题,可以设置padding,margin,bottom
 * @params setValue 需要设置的值  | type 设置的类型，比如说padding
 * @useage  v-fitIphoneX="{ type: 'padding', pxNum: 10 }"
 */
function judgeIPhoneX() {
    // 判断是否是iphoneX
    const ua = window.navigator.userAgent
    const isIos = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    return !!(
        isIos &&
        window.screen.height >= 812 &&
        window.screen.width >= 375
    )
}

export const fitIphoneX = {
    bind(el, binding) {
        const isIPhoneX = judgeIPhoneX()
        const pxNum = binding.value.pxNum
        const iphoneXNum = ((pxNum || 30) + 34) / 100
        const setValue = isIPhoneX ? iphoneXNum : (pxNum || 30) / 100
        switch (binding.value.type) {
            case 'padding':
                el.style.paddingBottom = `${setValue}rem`
                break
            case 'margin':
                el.style.marginBottom = `${setValue}rem`
                break
            default:
                el.style.bottom = `${setValue}rem`
                break
        }
    },
}

/**
 * @description 修复ios手机失去焦点页面未还原问题
 * @params
 * @useage v-reset-page
 */
export const resetPage = {
    inserted() {
        // 监听键盘收起事件
        document.body.addEventListener('focusout', () => {
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                // 软键盘收起处理
                setTimeout(() => {
                    const scrollHeight =
                        document.documentElement.scrollTop ||
                        document.body.scrollTop ||
                        0
                    window.scrollTo({
                        left: 0,
                        top: Math.max(scrollHeight - 1, 0),
                        behavior: 'smooth',
                    })
                }, 100)
            }
        })
    },
}

/**
 * @description input输入框只能输入数字
 * @params
 * @useage v-number-only
 */
export const numberOnly = {
    bind(el) {
        el.handlerInput = function () {
            el.value = el.value.replace(/[\D]/g, '')
            // let value = el.value
            // let maxlength = binding.value
            // if(maxlength && value.length > maxlength){
            //   el.value = value.slice(0, maxlength)
            // }
        }
        el.handlerKeyup = function () {
            el.value = el.value.match(/\d+/) ? el.value.match(/\d+/)[0] : ''
        }
        el.addEventListener('input', el.handlerInput)

        el.addEventListener('keyup', el.handlerKeyup)
    },
    unbind(el) {
        el.removeEventListener('keyup', el.handlerKeyup)
    },
}

/**
 * @description 自动获取焦点
 * @params
 * @useage v-auto-focus
 */

export const autoFocus = {
    componentUpdated(el, obj) {
        obj.value && el.focus()
    },
}
