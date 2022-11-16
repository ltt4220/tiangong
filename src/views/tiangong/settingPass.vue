<template>
<div class="settingPass-container">
    <h3 class="settingPass-title-tt">
        <i class="iconfont icon-ARROW-left-copy" @click="goHome"></i>
        <span class="title-box">设置操作密码</span>
        <span class="title-info">操作密码用于藏品转赠等操作</span>
    </h3>
    <div class="settingPass-body">
        <p class="settingPass-tishi-tt">请输入您已实名认证的身份证号后4位进行验证</p>
        <div class="settingPass-pass">
            <input :readonly="value" @blur="addblur" v-for="(item,index) in captchas" :key="index" v-model="item.num" :id="'captcha'+index" @input="inputFinash(index)" @keydown="inputDirection(index)" class="captcha_input_box row-center" :type="index<=2?'tel':'text'" maxlength="1" />
            <div class="icont-box" v-show="value">
                <i class="iconfont icon-duigou"></i>
                验证成功
            </div>
        </div>
        <ul class="settingPass-editor">
            <li>
                <p>请设置6位数字密码</p>
                <input :disabled="!value" @blur="addblur" type="password" maxlength="6" v-model.number="form.userPwd">
            </li>
            <li>
                <p>再次输入确认密码</p>
                <input :disabled="!value" @blur="addblur" type="password" maxlength="6" v-model.number="form.confirmPwd">
            </li>
        </ul>
        <div :class="['settingPass-btn',{'active':form.userPwd && form.confirmPwd}]">
            <button @click="submit">设置</button>
        </div>
    </div>
    <pubilcPopBox @addcanle="addcanle" :content="errContent" :ispopshow="ispopshow" @callback="callback" :iscallback="iscallback">
    </pubilcPopBox>
</div>
</template>

<script>
import {
    saveTransferPwd,
    checkUserAuth,
} from '@/assets/api/gateway';
import pubilcPopBox from '@/components/culture-gather/public-pop-box';
import {
    Toast
} from 'vant';
import 'vant/es/toast/style';
import encrypt from '@/utils/encrypt.js';
let inputList = [{
        num: ""
    },
    {
        num: ""
    },
    {
        num: ""
    },
    {
        num: ""
    },
];
export default {
    name: 'settingPass',
    components: {
        pubilcPopBox,
    },
    data() {
        return {
            value: false,
            ispopshow: false,
            errContent: '为了你的操作安全，请先进行设置',
            iscallback: () => {},
            activeInput: 0,
            captchas: JSON.parse(JSON.stringify(inputList)),
            form: {
                userPwd: '',
                confirmPwd: '',

            }
        }
    },
    methods: {
        submit() {
            if (!this.value) {
                this.ispopshow = true;
                return this.errContent = '请验证身份证生日月份';
            }
            if (!this.form.userPwd) {
                this.ispopshow = true;
                return this.errContent = '请输入密码';
            }
            if (!this.form.confirmPwd) {
                this.ispopshow = true;
                return this.errContent = '请输入确认密码'
            }
            let reg = /^\d{6}$/;
            if (!reg.test(this.form.userPwd)) {
                this.ispopshow = true;
                return this.errContent = '请输入6位数字的密码'
            }
            if (!reg.test(this.form.confirmPwd)) {
                this.ispopshow = true;
                return this.errContent = '请输入6位数字的确认密码'
            }
            if (this.form.userPwd !== this.form.confirmPwd) {
                this.ispopshow = true;
                return this.errContent = '两次输入的密码不致'
            }
            let query = {
                userPwd: encrypt.Encrypt(this.form.userPwd),
                confirmPwd: encrypt.Encrypt(this.form.confirmPwd),
                shopPath: this.$route.params.shopPath,
            }
            saveTransferPwd(query).then(res => {
                if (res.status != 200) {
                    this.ispopshow = true;
                    return this.errContent = res.errMsg;
                }
                this.$router.go(-1)
            })
        },
        addCheckUserAuth(userBirth, dom) {
            let obj = {
                shopPath: this.$route.params.shopPath,
                userBirth
            }
            checkUserAuth(obj).then(res => {
                if (res.status != 200) {
                    this.captchas = JSON.parse(JSON.stringify(inputList));
                    let dom = document.getElementById("captcha" + 0);
                    if (dom) dom.focus();
                    return Toast({
                        message: res.errMsg,
                        icon: 'fail',
                    });
                }
                this.value = true;
                dom.blur() // 失去焦点
            })
        },
        addblur() {
            const u = navigator.userAgent
            const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isIOS) {
                this.blurAdjust()
            }
            // 解决苹果不回弹页面
        },
        blurAdjust(e) {
            setTimeout(() => {
                if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
                    return
                }
                let result = 'pc';
                if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
                    result = 'ios'
                } else if (/(Android)/i.test(navigator.userAgent)) { //判断Android
                    result = 'android'
                }
                if (result = 'ios') {
                    document.activeElement.scrollIntoViewIfNeeded(true);
                }
            }, 100)
        },
        // 控制前后方向
        inputDirection(index) {
            let val = this.captchas[index].num;
            // 回退键处理
            if (event.keyCode == 8 && val == "") {
                // 重新校准
                let dom = document.getElementById("captcha" + (index - 1));
                this.activeInput = index - 1;
                if (dom) dom.focus();
            }
            if (event.keyCode != 8 && val != "") {
                let dom = document.getElementById("captcha" + (index + 1));
                this.activeInput = index + 1;
                if (dom) dom.focus();
            }
        },
        // 输入框相互联动
        inputFinash(index) {
            let val = this.captchas[index].num;
            this.activeInput = val ? index + 1 : index - 1;
            let dom = document.getElementById("captcha" + this.activeInput);
            if (dom) dom.focus();
            let code = this.captchas.map((x) => x.num).join("");
            if (code.length == 4) {
                let _dom = document.getElementById("captcha" + index);
                this.addCheckUserAuth(code, _dom);
            }
        },
        addcanle(el) {
            this.ispopshow = el;
        },
        goHome() {
            this.$router.go(-1)
        },
        callback(el) {
            if (el) {
                this.iscallback();
            }
            this.ispopshow = false;
            this.iscallback = () => {};
        },
    },
}
</script>

<style lang="scss">
@import '../../styles/tiangong/commen.scss';
</style><style lang="scss" scoped>
@import '../../styles/tiangong/settingPass.scss';
</style>
