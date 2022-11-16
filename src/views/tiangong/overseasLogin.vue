<template>
<div id="login" class="login-box box-noaccount">
    <div class="phone-box-content">
        <!-- <span v-html="setCheck"></span> -->
        <div class="login-mode">
            <p class="log"></p>
            海外大陆用户登录
        </div>
        <div class="login-sms">
            <div class="sms-form">
                <div class="form-item">
                    <input class="input-text input-phone" @blur="addblur" type="email" v-model="form.phoneNumber" placeholder="请输入注册的电子邮箱地址" id="mobileNo" maxlength="50">
                </div>
                <!-- 账号密码登录 -->
                <div>
                    <div class="form-item">
                        <input class="input-text" @blur="addblur" type="password" v-model="form.password" placeholder="请输入密码" id="mobileNo" maxlength="20">
                    </div>
                </div>
            </div>
            <Checkbox icon-size="36" v-model="checked">我已阅读并同意<span @click.stop="addLink(1)">《用户协议》</span>及<span @click.stop="addLink(2)">《隐私政策》</span>
            </Checkbox>
            <div :class="['sms-button overseas-button',{'sms-button-show':setCheck}]" @click="submit">立即登录</div>
        </div>
    </div>
    <div class="password-login duanxin overseas-button" @click="changeLogin">
        <button>短信验证码登录</button>
    </div>
    <pubilcPopBox :iscanle="iscanle" :content="errContent" :ispopshow="ispopshow" @callback="callback">
    </pubilcPopBox>
</div>
</template>

<script>
import {
    Checkbox,
} from 'vant';
import 'vant/es/checkbox/style';
import encrypt from '@/utils/encrypt.js';
import pubilcPopBox from '@/components/culture-gather/public-pop-box';
import {
    loginEmail
} from '@/assets/api/getCaptchaUrl';
import {
    signLoginUser,
    withAllSecurity,
} from '@/assets/api/gateway';
export default {
    name: 'overseasLogin',
    components: {
        pubilcPopBox,
        Checkbox
    },
    data() {
        return {
            isCode: this.$route.query.isCode || '',
            isCheckPass: this.$route.query.type || '',
            form: {
                phoneNumber: '',
                code: '',
                captcha: '',
                password: ''
            },
            user: {},
            ispopshow: false,
            errContent: '',
            iscanle: false,
            checked: false,
            noTouch: false,
        }
    },
    computed: {
        setCheck() {
            if (this.form.phoneNumber && this.form.password && this.checked) {
                return true;
            }
            return false
        }
    },
    methods: {
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
        callback(el) {
            this.ispopshow = false;
        },
        // 切换登录方式
        changeLogin() {
            return this.$router.push({
                name: 'cultureGatherLogin'
            })
        },
        submit() {
            let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            if (this.form.phoneNumber == '') {
                this.ispopshow = true;
                this.errContent = '邮箱不能为空';
                return
            }
            if (!reg.test(this.form.phoneNumber)) {
                this.ispopshow = true;
                this.errContent = '邮箱有误，请重填';
                return;
            }
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
            loginEmail(query).then(res => {
                this.noTouch = false
                let data = res;
                let obj = {
                    noActive: '账号未完成注册，请重新注册',
                    isFreeze: '账号已冻结',
                    LoginLimit: '密码输错次数过多,请明天再试',
                };
                if (data.status == 'success') {
                    let user = data.user || {};
                    console.log(user, 'ddddddd')
                    localStorage.setItem('userType', user.userType);
                    this.getUserInfo(data.token, data.isInitPwd)
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
                this.noTouch = false
            });
        },
        getUserInfo(token, isPass = true) {
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
                this.getNftUrl();
                if (isPass) {
                    this.$router.replace({
                        name: 'checkUserInfo',
                        query: this.$route.query || {}
                    });

                } else {
                    this.$router.replace({
                        name: ((this.$route.query || {}).name) || 'cultureGatherIndex',
                        query: this.$route.query || {}
                    });
                }

            })
        },
        getNftUrl() {
            let obj = {
                userMobileNo: this.form.phoneNumber,
                shopPath: this.$route.params.shopPath,
            }
            signLoginUser(obj).then(res => {

                if (res.status != 200) {
                    return
                }
            });
        },
    },
}
</script>

<style lang="scss">
@import '../../styles/tiangong/commen.scss';
@import '../../styles/tiangong/login.scss';
</style>
