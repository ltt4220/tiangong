<template>
<div id="creatBlockchain" class="creat-blockchain-box culture-commen-background">
    <div class="creatBlockchain-box">
        <div class="creat-blockchain-header">
            <div class="blockchain-header-title">实名认证</div>
            <div class="blockchain-header-tip">
                * 请确保注册手机号与实名信息匹配，否则无法通过
                认证。</div>
        </div>
        <div class="blockchain-form">
            <div class="form-item">
                <label class="form-item-label">已注册手机号</label>
                <input @blur="addblur" class="input-text input-phone" type="text" v-model.number="form.phoneNumber" placeholder="请输入11位手机号" id="mobileNo" maxlength="11">
            </div>
            <div class="form-item">
                <label class="form-item-label">真实姓名</label>
                <input @blur="addblur" type="text" v-model="form.userName" placeholder="输入真实姓名" class="input-text input-phone">
            </div>
            <div class="form-item">
                <label class="form-item-label">身份证号</label>
                <input @blur="addblur" type="text" v-model="form.IDCard" maxlength="18" placeholder="输入身份证号" class="input-text input-phone">
            </div>
        </div>
        <div :class="['personal-submit',{'sms-button-show':setCheck}]" @click="submit"><span>点击认证</span></div>

    </div>
    <pubilcPopBox :titlepic="titlepic" :iscallback="iscallback" :iscanle="iscanle" :content="errContent" :ispopshow="ispopshow" @callback="callback">
    </pubilcPopBox>
</div>
</template>

<script>
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
    name: 'creatBlockChain',
    components: {
        pubilcPopBox,
        Checkbox
    },
    data() {
        return {
            checkedRadio: false,
            form: {
                userName: '',
                IDCard: '',
                phoneNumber: '',
                code: '',
            },
            user: {
                userId: ''
            },
            countdown: {
                total: 60, //总时间
                time: 60, //当前处于的时间
                isOn: false //是否处于倒计时
            },
            checked: false,
            ispopshow: false,
            errContent: '',
            iscanle: false,
            titlepic: false,
            iscallback: () => {}
        }
    },
    computed: {
        setCheck() {
            if (this.form.phoneNumber && this.form.userName && this.form.IDCard && this.checked) {
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
            if (this.form.userName == '') {
                this.ispopshow = true;
                return this.errContent = '请输入真实姓名';
            }
            if (this.form.phoneNumber == '') {
                this.ispopshow = true;
                return this.errContent = '手机号不能为空';
            }
            if (this.form.IDCard == '') {
                this.ispopshow = true;
                return this.errContent = '请输入身份证号';
            }
            if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.form.IDCard))) {
                this.ispopshow = true;
                return this.errContent = '无效身份证号，请检查填写正确';
            }
            let obj = {
                userNickName: this.form.userName,
                userTelephone: this.form.phoneNumber,
                userCardNo: this.form.IDCard,
                fromUserTeamAutoRegister: 1,
            }
            userAuth(obj).then(res => {

                if (res.status != 200) {
                    this.ispopshow = true;
                    return this.errContent = res.errMsg
                }
                const _data = res.data || '认证通过';
                localStorage.setItem('userType', 2);
                this.ispopshow = true;
                this.titlepic = true;
                this.errContent = `${_data}`;
                this.iscallback = () => {
                    if (this.$route.query.name && this.$route.query.name == "cultureUserCenter") {
                        this.$router.push({
                            name: 'cultureUserCenter',
                        });
                    } else {
                        this.$router.push({
                            name: 'cultureGatherDetail',
                            query: {
                                id: this.$route.query.id || ''
                            }
                        });
                    }

                }
            })
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
                this.form.phoneNumber = this.user.userMobileNo;
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
