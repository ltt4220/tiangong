<template>
<div class="confirmExamples-content-tt">
    <h3 class="confirmExamples-title-tt">
        <i class="iconfont icon-ARROW-left-copy" @click="goHome"></i>
        确认转赠
    </h3>
    <div class="confirmExamples-detail">
        <div class="confirmExamples-detail-top">
            <img alt="" class="confirmExamples-img" :src="detail.spuImages">
            <div class="confirmExamples-info">
                <h3 class="confirmExamples-info-title">{{detail.spuSubtitle}}{{detail.spuName}}</h3>
                <p class="confirmExamples-info-subTitle">{{detail.spuProduce}}</p>
                <p class="confirmExamples-info-subTitle">当前拥有者：{{detail.userName || sub(detail.userMobileNo,3,4,4)}}</p>
                <p class="confirmExamples-info-subTitle">数量 {{detail.seriseNoList && detail.seriseNoList.length}} 份</p>
            </div>
        </div>
        <div :class="['menuItem-bottom-info menuItem-bottom-haxi',{'warp-menuItem-box':detail.seriseNoList && detail.seriseNoList.length>3 && isCheck,'nowarp-menuItem-box':detail.seriseNoList && detail.seriseNoList.length>3 && !isCheck}]">
            <div class="menuItem-bottom-left">藏品编号<i @click="addCheck" :class="['iconfont',{'icon-arrowBottom':detail.seriseNoList && detail.seriseNoList.length>3,'active-icon': detail.seriseNoList && detail.seriseNoList.length>3 && isCheck}]"></i></div>
            <div class="menuItem-bottom-right">
                <span v-for="(ele,e) in detail.seriseNoList" :key="e">编码：{{ele}}</span>
            </div>
        </div>
    </div>
    <div class="confirmExamples-body">
        <p class="confirmExamples-tishi-tt">温馨提示，一旦发起数字藏品转赠，即代表你同意以下条件：</p>
        <ul class="confirmExamples-list">
            <li>转赠成功后不可撤销。</li>
            <li>我们不支持任何形式的有偿转赠，请警惕欺诈风险。一旦发现异常行为，我们会对相关账户采取限制措施。</li>
        </ul>
    </div>
    <div class="confirmExamples-btn">
        <p>24 小时内对方未领取，将退还给你</p>
        <button @click="addSetTransferPwd">确定转赠</button>
    </div>
    <Overlay :show="isPassWord">
        <div class="pubilic-content">
            <div class="colse-headerbtn" @click="isPassWord=false">
                <i class="iconfont icon-close"></i>
            </div>
            <div class="head-box">
                <h3>请输入操作密码</h3>
            </div>
            <div class="cont-box">
                <input @blur="addblur" v-for="(item,index) in captchas" :key="index" v-model="item.num" :id="'captcha'+index" @input="inputFinash(index)" @keydown="inputDirection(index)" class="captcha_input_box row-center" type="tel" maxlength="1" />
            </div>
            <div class="foot-box">
                <button @click="setPassRouter">忘记密码？<span>去设置 ></span></button>
            </div>
        </div>
    </Overlay>
    <pubilcPopBox :titlename="titlename" :isIcon="isIcon" :comipteTit="comipteTit" :iscanle="iscanle" @addcanle="addcanle" :content="errContent" :ispopshow="ispopshow" @callback="callback" :iscallback="iscallback">
    </pubilcPopBox>
</div>
</template>

<script>
import {
    Overlay,
    Toast
} from 'vant';
import {
    transferSpuInfo,
    setTransferPwd,
    checkUserPwd
} from '@/assets/api/gateway';
import 'vant/es/toast/style';
import encrypt from '@/utils/encrypt.js';
import pubilcPopBox from '@/components/culture-gather/public-pop-box';
let inputList = [{
        num: "",
        pass: ""
    },
    {
        num: "",
        pass: ""
    },
    {
        num: "",
        pass: ""
    },
    {
        num: "",
        pass: ""
    },
    {
        num: "",
        pass: ""
    },
    {
        num: "",
        pass: ""
    },
];
export default {
    name: 'confirmExamples',
    components: {
        pubilcPopBox,
        Overlay
    },
    data() {
        return {
            ispopshow: false,
            errContent: '为了你的操作安全，请先进行设置',
            iscanle: true,
            isIcon: false,
            comipteTit: '设置',
            titlename: '暂未设置操作密码',
            iscallback: () => {},
            isPassWord: false,
            isPopStats: false,
            activeInput: 0,
            captchas: JSON.parse(JSON.stringify(inputList)),
            detail: {},
            spuId: this.$route.query.spuId || '',
            nftUserId: this.$route.query.nftUserId || '',
            nftRecordIds: [],
            isCheck: false
        }
    },
    beforeRouteEnter(to, from, next) {
        if (from.name && from.name == "settingPass") {
            return next(vm => {
                vm.addTransferSpuInfo()
            })
        }
        next()
    },
    created() {
        this.nftRecordIds = JSON.parse(window.sessionStorage.getItem('nftRecordId')) || [];
        this.addTransferSpuInfo();
    },
    methods: {
        addCheck() {
            this.isCheck = !this.isCheck;
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
        sub(str, startLength, endLength, num) {
            return encrypt.subText(str, startLength, endLength, num)
        },
        setPassRouter() {
            this.$router.push({
                name: 'checkWord'
            });
        },
        addCheckUserPwd(userPwd) {
            let query = {
                shopPath: this.$route.params.shopPath,
                userPwd: encrypt.Encrypt(userPwd),
                nftRecordIds: this.nftRecordIds,
                nftUserId: this.nftUserId,
                spuId: this.spuId,
            }
            checkUserPwd(query).then(res => {
                if (res.status != 200) {
                    this.captchas = JSON.parse(JSON.stringify(inputList));
                    let dom = document.getElementById("captcha" + 0);
                    if (dom) dom.focus();
                    return Toast({
                        message: res.errMsg,
                        icon: 'fail'
                    });
                }
                let orderNum = res.data
                this.$router.push({
                    name: 'loadingConfirmExamples',
                    query: {
                        orderNum
                    }
                })
            })
        },
        addSetTransferPwd() {
            let query = {
                shopPath: this.$route.params.shopPath,
            }
            setTransferPwd(query).then(res => {
                if (res.status != 200) {
                    return Toast({
                        message: res.errMsg,
                        icon: 'fail'
                    });
                }
                let data = res.data || {};
                if (data.pwdStatus == 'no') {
                    this.ispopshow = true
                    this.iscallback = () => {
                        this.$router.push({
                            name: 'settingPass'
                        });
                    }

                } else {
                    this.captchas = JSON.parse(JSON.stringify(inputList));
                    this.isPassWord = true;
                    this.$nextTick(() => {
                        let dom = document.getElementById("captcha0");
                        if (dom) dom.focus();
                    })

                }
            })
        },
        addTransferSpuInfo() {
            let query = {
                nftRecordIds: this.nftRecordIds,
                nftUserId: this.nftUserId,
                shopPath: this.$route.params.shopPath,
                spuId: this.spuId,
            }
            transferSpuInfo(query).then(res => {
                if (res.status != 200) return
                let data = res.data || {};
                this.detail = data;
                console.log(this.detail, "ddddddddddd")
            })
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
            this.captchas[index].pass = this.captchas[index].num;
            this.captchas[index].num = this.captchas[index].num ? "*" : '';
            this.activeInput = val ? index + 1 : index - 1;
            let dom = document.getElementById("captcha" + this.activeInput);
            if (dom) dom.focus();
            let code = this.captchas.map((x) => x.pass).join("");
            if (code.length == 6) {
                this.addCheckUserPwd(code);
            }
        },
        setPopCont() {
            if (this.isPopStats) {
                this.iscanle = false;
                this.titlename = '温馨提示';
                this.comipteTit = '确定';
                this.isIcon = true;

            } else {
                this.comipteTit = '设置';
                this.iscanle = true;
                this.isIcon = false;
                this.errContent = '为了你的操作安全，请先进行设置';
                this.titlename = '暂未设置操作密码';
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
    }
}
</script>

<style lang="scss">
@import '../../styles/tiangong/commen.scss';
</style><style lang="scss" scoped>
@import '../../styles/tiangong/confirmExamples.scss';
</style>
