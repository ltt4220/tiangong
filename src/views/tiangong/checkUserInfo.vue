<template>
<div id="creatBlockchain" class="creat-blockchain-box culture-commen-background">
    <div class="creatBlockchain-box">
        <div class="creat-blockchain-header">
            <div class="blockchain-header-title">修改密码</div>
            <div class="blockchain-header-tip">
                *修改密码后请妥善保存好新密码，如有任何问题请
                联系我们的客服。</div>
        </div>
        <div class="blockchain-form">
            <div class="form-item">
                <label class="form-item-label">已注册邮箱</label>
                <input readonly class="input-text input-phone" type="text" v-model.number="form.userEmail" id="mobileNo" maxlength="50">
            </div>
            <div class="form-item">
                <label class="form-item-label">初始密码</label>
                <input @blur="addblur" type="password" v-model="form.initPwd" maxlength="20" placeholder="输入客服提供的初始密码" class="input-text input-phone">
            </div>
            <div class="form-item">
                <label class="form-item-label">新密码</label>
                <input @blur="addblur" type="password" v-model="form.userPwd" maxlength="20" placeholder="8到20位字母、数字和符号" class="input-text input-phone">
            </div>
            <div class="form-item">
                <label class="form-item-label">确认密码</label>
                <input @blur="addblur" type="password" v-model="form.confirmPwd" maxlength="20" placeholder="再次输入确认" class="input-text input-phone">
            </div>
        </div>
        <div :class="['personal-submit password-button',{'sms-button-show':setCheck}]" @click="submit"><span>提交并登录</span></div>
        <div class="personal-submit personal-submit-skip" @click="addLink">跳过</div>
    </div>
    <pubilcPopBox :titlepic="titlepic" :iscallback="iscallback" :iscanle="iscanle" :content="errContent" :ispopshow="ispopshow" @callback="callback">
    </pubilcPopBox>
</div>
</template>

<script>
import {
    nftUserModifyPwd
} from '@/assets/api/getCaptchaUrl'
import {
    userAuth,
    withAllSecurity
} from '@/assets/api/gateway';
import {
    Checkbox
} from 'vant';
import encrypt from '@/utils/encrypt.js';
import 'vant/es/checkbox/style';
import pubilcPopBox from '@/components/culture-gather/public-pop-box';
export default {
    name: 'checkUserInfo',
    components: {
        pubilcPopBox,
        Checkbox
    },
    data() {
        return {
            checkedRadio: false,
            form: {
                userPwd: '',
                confirmPwd: '',
                initPwd: '',
                userEmail: ''
            },
            user: {
                userId: ''
            },
            countdown: {
                total: 60, //总时间
                time: 60, //当前处于的时间
                isOn: false //是否处于倒计时
            },
            ispopshow: false,
            errContent: '',
            iscanle: false,
            isLoginShow: false,
            titlepic: false,
            iscallback: () => {}
        }
    },
    computed: {
        setCheck() {
            if (this.form.phoneNumber && this.form.userName && this.form.IDCard) {
                return true;
            }
            return false;
        }
    },
    created() {
        this.getUserInfo();
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
        callback(el) {
            if (el) {
                this.iscallback();
            }
            this.ispopshow = false;
            this.titlepic = false;
            this.iscallback = () => {};
        },
        submit() {
            if (this.form.initPwd == '') {
                this.ispopshow = true;
                return this.errContent = '请输入客服提供的初始密码';
            }
            if (this.form.userPwd == '') {
                this.ispopshow = true;
                return this.errContent = '请输入新密码';
            }
            let reg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,20}$/;
            if (!reg.test(this.form.userPwd)) {
                this.ispopshow = true;
                return this.errContent = '必须是8-20位字母、数字或字符，至少包含两种';
            }
            if (this.form.confirmPwd == '') {
                this.ispopshow = true;
                return this.errContent = '请再次输入新密码';
            }
            if (this.form.userPwd !== this.form.confirmPwd) {
                this.ispopshow = true;
                return this.errContent = '两次输入的新密码不致';
            }
            let obj = {
                initPwd: encrypt.Encrypt(this.form.initPwd),
                userPwd: encrypt.Encrypt(this.form.userPwd),
                confirmPwd: encrypt.Encrypt(this.form.confirmPwd),
                shopPath: this.$route.params.shopPath,
            }
            nftUserModifyPwd(obj).then(res => {

                if (res.status != 200) {
                    this.ispopshow = true;
                    return this.errContent = res.errMsg
                }
                const _data = res.data || '修改成功';
                this.ispopshow = true;
                this.titlepic = true;
                this.errContent = `${_data}`;
                this.iscallback = () => {
                    this.$router.replace({
                        name: 'overseasLogin',
                    });

                }
            })
        },
        addLink() {
            this.$router.push({
                name: ((this.$route.query || {}).name) || 'cultureGatherIndex',
            });
        },
        getUserInfo() {
            let token = window.localStorage.getItem("jwtToken") || ''
            let query = {
                shopPath: this.$route.params.shopPath,
                token: encrypt.Encrypt(JSON.stringify({
                    token,
                    timeStamp: Date.parse(new Date())
                }))
            };
            withAllSecurity(query).then(res => {
                if (res.status != 200) {
                    return
                }
                let data = encrypt.decodeAesString(res.data || {});
                this.user = data;
                this.form.userEmail = this.user.userEmail || '';
            })
        },
    },
    filters: {

    }
}
</script>

<style lang="scss">
@import '../../styles/tiangong/commen.scss';
@import '../../styles/tiangong/creat-blockchain.scss';
</style>
