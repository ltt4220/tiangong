<template>
<div id="login" :class="['login-box',{'box-account':isCode}]">
    <div class="pop-box" v-if="isCode"></div>
    <div :class="{'zhanghao-box-content':isCode,'phone-box-content':!isCode}">
        <div class="login-mode">
            <p class="log"></p>
            {{isCode == 0?'欢迎来到天工严选':'文化云账号登录'}}
        </div>
        <div class="login-sms">
            <div :class="['sms-form',{'no-bottom':!isCode}]">
                <div class="form-item">
                    <input class="input-text input-phone" @blur="addblur" type="text" v-model.number="form.phoneNumber" placeholder="请输入11位手机号" id="mobileNo" maxlength="11">
                </div>
                <!-- 短信验证码登录 -->
                <div v-if="isCode == 0">
                    <div class="form-item">
                        <input class="input-text" @blur="addblur" v-model="form.captcha" placeholder="请输入图形验证码">
                        <div class="code-box" @click="loadVcode">
                            <div class="change-code">看不清楚？换一张</div>
                            <img :src="imgCodeUrl" class="code-img">
                        </div>
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
                <!-- 账号密码登录 -->
                <div v-if="isCode == 1">
                    <div class="form-item">
                        <input class="input-text" @blur="addblur" type="password" v-model="form.password" placeholder="8到20位字母、数字和符号" id="mobileNo" maxlength="20">
                    </div>
                </div>
                <div class="form-item form-item-userName" v-show="userName">
                    <span>邀请人：{{tel}} &emsp; {{userName}}</span>
                </div>
            </div>
            <div v-if="isCode" :class="['sms-button',{'sms-button-show':setCheck}]" @click="submit(isCode)"><span>立即登录</span></div>
            <Checkbox v-if="isCode" icon-size="36" v-model="checked">我已阅读并同意<span @click.stop="addLink(1)">《用户协议》</span>及<span @click.stop="addLink(2)">《隐私政策》</span>
            </Checkbox>
            <Checkbox v-else icon-size="36" v-model="checked">未注册的手机号通过验证后将自动注册或登录，登录即同意<span @click.stop="addLink(1)">《用户协议》</span>及<span @click.stop="addLink(2)">《隐私政策》</span>
            </Checkbox>
            <div v-if="!isCode" :class="['sms-button',{'sms-button-show':setCheck}]" @click="submit(isCode)"><span>立即登录</span></div>
        </div>
    </div>
    <!-- <div v-if="!isCode" class="password-login zhanghao haiwaiAccount" @click="showPopup(false,false)">
        <button>海外大陆用户登录</button>
    </div> -->
    <div :class="['password-login',{'duanxin':isCode,'zhanghao':!isCode}]" @click="changeLogin">
        <button>{{isCode?'短信验证码登录':' 文化云账号登录'}}</button>
    </div>
    <pubilcPopBox :iscanle="iscanle" :content="errContent" :ispopshow="ispopshow" @callback="callback">
    </pubilcPopBox>
    <div :class="['brand-desc',{'close-brand-desc':!blockLink && ispopBoxLink,'animation-desc':blockLink}]">
        <div class="brand-desc-header">
            <div class="brand-desc-title">海外大陆用户</div>
            <div class="brand-desc-headerbtn" @click="showPopup(false,true)">
                <i class="iconfont icon-close"></i>
            </div>
        </div>
        <p class="info-text" @click="addOverse(false)">我没有账号，联系客服开通 <i class="iconfont icon-arrowRight"></i></p>
        <p class="info-text" @click="addOverse(true)">我已有账号，立即登录 <i class="iconfont icon-arrowRight"></i></p>
    </div>
    <slideVerify></slideVerify>
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
    loginSendCode,
    terminalLogin,
    codeLogin
} from '@/assets/api/getCaptchaUrl';
import {
    signLoginUser,
    withAllSecurity,
} from '@/assets/api/gateway';
import slideVerify from '@/components/culture-gather/slide-verify'
export default {
    name: 'cultureGatherLogin',
    components: {
        pubilcPopBox,
        Checkbox,
        slideVerify
    },
    data() {
        return {
            ispopBoxLink: false,
            blockLink: false,
            isCode: this.$route.query.isCode || '',
            userName: this.$route.query.userName|| '',
            inviteId:this.$route.query.inviteId|| '',
            tel:this.$route.query.tel|| '',
            form: {
                phoneNumber: '',
                code: '',
                captcha: '',
                password: ''
            },
            vcode: {},
            imgCodeUrl: '',
            countdown: {
                total: 60, //总时间
                time: 60, //当前处于的时间
                isOn: false //是否处于倒计时
            },
            user: {},
            ispopshow: false,
            errContent: '',
            iscanle: false,
            checked: false,
            isnotify: false,
            lastTime: false,
            noTouch: false,
            workLink: 'https://work.weixin.qq.com/kfid/kfc7625783dcdee8167',
        }
    },
    computed: {
        setCheck() {
            if (this.isCode) {
                if (this.form.phoneNumber && this.form.password && this.checked) {
                    return true;
                }
            } else {
                if (this.form.phoneNumber && this.form.captcha && this.form.code && this.checked) {
                    return true;
                }
            }
            return false
        }
    },
    created() {
        console.log('ddddd', this.userName)
        this.loadVcode()
    },
    methods: {
        addOverse(bool) {
            if (bool) {
                this.$router.replace({
                    name: 'overseasLogin'
                })
            } else {
                this.subWechatKefuCallBack();
            }
        },
        subWechatKefuCallBack() {
            if (typeof window.whySDK == 'object' && typeof whySDK.wechatKefu == 'function') {
                var data = {
                    "corporateId": "ww2efa250da5dabd58",
                    "kfUrl": "https://work.weixin.qq.com/kfid/kfc7625783dcdee8167"
                };
                whySDK.wechatKefu(JSON.stringify(data));
            } else {
                window.location.href = this.workLink;
            }
        },
        showPopup(params, bool = false) {
            if (!params) {
                this.blockLink = !this.blockLink
                this.ispopBoxLink = bool;
            }
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
        addLink(i) {
            let obj = {
                1: 'userAgreement',
                2: 'privacyAgreement',
            };
            return this.$router.push({
                name: obj[i]
            });
        },
        loadVcode() {
            if (this.lastTime) return;
            this.lastTime = true;

            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            this.uid = S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
            this.imgCodeUrl = `${this.$config.getCaptchaUrl}/muser/getCaptcha.do?captchaId=${this.uid}&fontColor=white`;
            setTimeout(() => {
                this.lastTime = false;
            }, 2000);
        },
        callback(el) {
            this.ispopshow = false;
        },
        // 切换登录方式
        changeLogin() {
            this.lastTime = false;
            this.checked = false;
            this.isCode = Number(!this.isCode)
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
            if (!/\w{4}/.test(this.form.captcha)) {
                this.ispopshow = true;
                this.errContent = '请输入图形验证码';
                return;
            }
            if (this.lastTime) return;
            this.lastTime = true;
            let query = {
                mobileNo: this.form.phoneNumber,
                captchaId: this.uid,
                captcha: this.form.captcha,
                shopPath: this.$route.params.shopPath,
            }
            loginSendCode(query).then(res => {
                if (res.status === '0') {
                    Toast({
                        message: res.data,
                        icon: 'close'
                    });
                    this.lastTime = false;
                    this.loadVcode();
                } else if (res.status === '1') {
                    Toast({
                        message: '验证码已发送',
                        icon: 'passed'
                    });
                    this.lastTime = false;
                    this.setTime()
                }
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
            // 短信验证码
            if (params == 0) {
                if (this.form.captcha == '') {
                    this.ispopshow = true;
                    this.errContent = '图形验证码不能为空';
                    return
                }
                if (this.form.code == '') {
                    this.ispopshow = true;
                    this.errContent = '验证码不能为空';
                    return
                }
                if (!this.checked) {
                    this.ispopshow = true;
                    this.errContent = '请阅读并勾选《用户协议》及《隐私政策》';
                    return
                }
                if (this.noTouch) return
                this.noTouch = true;
                let obj = {
                    mobileNo: this.form.phoneNumber,
                    code: this.form.code,
                    shopPath: this.$route.params.shopPath,
                }
                codeLogin(obj).then(res => {
                    this.noTouch = false
                    if (res.data.status == 'success') {
                        let data = res.data || {};
                        localStorage.setItem('userType', data.userType);
                        this.getUserInfo(res.token)
                    } else {
                        this.loadVcode();
                        this.ispopshow = true;
                        this.errContent = `${res.data.errorMsg}`;
                        return
                    }
                }).finally(() => {
                    this.lastTime = false;
                })
                // 密码登录
            } else if (params == 1) {
                if (this.form.password == '') {
                    this.ispopshow = true;
                    this.errContent = '密码不能为空';
                    return
                }
                if (!this.checked) {
                    this.ispopshow = true;
                    this.errContent = '请阅读并勾选《用户协议》及《隐私政策》';
                    return
                }
                if (this.noTouch) return
                this.noTouch = true;
                let query = {
                    userName: this.form.phoneNumber,
                    userPwd: encrypt.Encrypt(this.form.password),
                    shopPath: this.$route.params.shopPath,
                }
                terminalLogin(query).then(res => {
                    this.noTouch = false
                    let data = res;
                    let obj = {
                        noActive: '账号未完成注册，请重新注册',
                        isFreeze: '账号已冻结',
                        LoginLimit: '密码输错次数过多,请明天再试',
                    };
                    if (data.status == 'success') {
                        let user = data.user || {}
                        localStorage.setItem('userType', user.userType);
                        this.getUserInfo(data.token)
                    } else if (data.status === 'noActive' || data.status === 'isFreeze' || data.status === 'LoginLimit') {
                        this.ispopshow = true;

                        this.errContent = obj[data.status]
                        return
                    } else {
                        this.ispopshow = true;
                        this.errContent = `账号和密码不匹配，请重新输入`;
                        return;
                    }

                }).finally(() => {
                    this.lastTime = false;
                });
            }
        },
        getUserInfo(token) {
            let query = {
                shopPath: this.$route.params.shopPath,
                token
            };
            withAllSecurity(query).then(res => {
                if (res.status != 200) {
                    return
                }
                let data = encrypt.decodeAesString(res.data || {});
                localStorage.setItem('jwtToken', data.jwtStr);
                this.getNftUrl()
                this.$router.replace({
                    name: ((this.$route.query || {}).name) || 'cultureGatherIndex',
                    query: this.$route.query || {}
                });
            })
        },
        getNftUrl() {
            let obj = {
                userMobileNo: this.form.phoneNumber,
                shopPath: this.$route.params.shopPath,
                inviteId:this.inviteId
            }
            signLoginUser(obj).then(res => {

                if (res.status != 200) {
                    return
                }
            });
        },
        formatUrl(url, user) {
            let urlLink = url
            return urlLink
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
</style>
