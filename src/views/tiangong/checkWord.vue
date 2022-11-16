<template>
<div id="login" class="login-box checkword-container">
    <div class="phone-box-content">
        <h3 class="checkwork-title-tt">
            <i class="iconfont icon-ARROW-left-copy" @click="goHome"></i>
            <div class="info-cont-checkword">
                <p class="st-icon-pandora">忘记操作密码</p>
                <p class="st-pandora">操作密码用于藏品转赠等操作</p>
                <p class="st-iconf">请输入您注册的手机号码，并通过短信验证，方可重置操作密码</p>
            </div>
        </h3>
        <div class="login-sms">
            <div class="sms-form">
                <div class="form-item">
                    <input class="input-text input-phone" @blur="addblur" type="text" v-model.number="form.phoneNumber" placeholder="请输入11位手机号" id="mobileNo" maxlength="11">
                </div>
                <div class="form-item">
                    <input class="input-text" @blur="addblur" v-model="form.code" placeholder="请输入6位验证码" id="loginCode" maxlength="6">
                    <div class="get-code" v-if="countdown.isOn">
                        {{countdown.time + 's后重新获取'}}
                    </div>
                    <div class="get-code" v-else @click="getVerificationCode">
                        获取验证码
                    </div>
                </div>
            </div>
            <div class="sms-button" @click="submit"><span>下一步</span></div>
        </div>
    </div>
    <pubilcPopBox :iscanle="iscanle" :content="errContent" :ispopshow="ispopshow" @callback="callback">
    </pubilcPopBox>
</div>
</template>

<script>
import {
    Checkbox,
    Toast
} from 'vant';
import 'vant/es/checkbox/style';
import 'vant/es/toast/style';
import encrypt from '@/utils/encrypt.js';
import pubilcPopBox from '@/components/culture-gather/public-pop-box';
import {
    sendCheckMsg,
    checkResetPwdCode
} from '@/assets/api/gateway';
export default {
    name: 'checkWord',
    components: {
        pubilcPopBox,
        Checkbox
    },
    data() {
        return {
            form: {
                phoneNumber: '',
                code: '',
            },
            imgCodeUrl: '',
            ispopshow: false,
            errContent: '',
            iscanle: false,
            lastTime: false,
            noTouch: false,
            countdown: {
                total: 60, //总时间
                time: 60, //当前处于的时间
                isOn: false //是否处于倒计时
            },
        }
    },
    methods: {
        goHome() {
            this.$router.go(-1)
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
        callback(el) {
            this.ispopshow = false;
        },
        getVerificationCode() {

            if (this.form.phoneNumber == '') {
                this.ispopshow = true;
                this.errContent = '请填写手机号码!';
                return
            }
            if (!(/^1[3456789]\d{9}$/.test(this.form.phoneNumber))) {
                this.ispopshow = true;
                this.errContent = '手机号码有误，请重填';
                return;
            }
            if (this.lastTime) return;
            this.lastTime = true;
            let query = {
                userMobileNo: this.form.phoneNumber,
                shopPath: this.$route.params.shopPath,
            }
            sendCheckMsg(query).then(res => {
                if (res.status != 200) {
                     this.ispopshow = true;
                     this.lastTime = false;
                    return this.errContent = `${res.errMsg}`;
                }
                Toast({
                    message: '验证码已发送',
                    icon: 'passed'
                });
                 this.setTime();
                this.lastTime = false;
            })
        },
        submit(params) {
            if (this.form.phoneNumber == '') {
                this.ispopshow = true;
                this.errContent = '手机号不能为空';
                return
            }
            if (!(/^1[3456789]\d{9}$/.test(this.form.phoneNumber))) {
                this.ispopshow = true;
                this.errContent = '手机号码有误，请重填';
                return;
            }
            if (this.form.code == '') {
                this.ispopshow = true;
                this.errContent = '验证码不能为空';
                return
            }
            if (this.noTouch) return
            this.noTouch = true;
            let obj = {
                userMobileNo: this.form.phoneNumber,
                code: this.form.code,
                shopPath: this.$route.params.shopPath,
            }
            checkResetPwdCode(obj).then(res => {
                this.noTouch = false;
                if (res.status != 200) {
                    this.ispopshow = true;
                    return this.errContent = `${res.errMsg}`;
                }
                this.$router.replace({name:'settingPass'})
            }).finally(() => {
                this.lastTime = false;
            })
        },
        setTime() {
            // 倒计时
            if (this.countdown.isOn) return;
            this.countdown.isOn = true;
            var timer = setInterval(() => {
                --this.countdown.time;
                if (this.countdown.time <= 0) {
                    clearInterval(timer);
                    this.countdown = {
                        isOn: false,
                        time: this.countdown.total
                    }
                }
            }, 1000);
        },
    },
}
</script>

<style lang="scss">
@import '../../styles/tiangong/commen.scss';
@import '../../styles/tiangong/login.scss';

@mixin flex($cont) {
    display: flex;
    align-items: center;
    justify-content: $cont;
}

.checkword-container {
    background: #000;

    .checkwork-title-tt {
        width: 100%;
        @include flex(center);
        font-size: 36px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 32px;
        position: relative;

        .info-cont-checkword {
            width: 100%;

            p {
                &.st-icon-pandora {
                    text-align: center;
                    font-size: 46px;
                }

                &.st-pandora {
                    font-size: 32px;
                    text-align: center;
                    margin-top: 50px;
                    color: rgba($color: #fff, $alpha: 0.8);
                }

                &.st-iconf {
                    margin-top: 80px;
                    font-size: 28px;
                    color: rgba($color: #fff, $alpha: 0.5);
                    line-height: 48px;
                    text-align: justify;
                }
            }
        }

        i {
            position: absolute;
            left: -60px;
            top: 0;
            color: #878788;
            font-weight: bold;
            font-size: 60px;
        }
    }
}
</style>
