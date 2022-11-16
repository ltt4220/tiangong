<template>
<div class="culture-orderDetail-box">
    <div class="order-detail-status">
        <!-- 预约成功 -->
        <i class="iconfont icon-sucess  status-img"></i>
        <h3>您已预约成功</h3>
        <p class="countdown">发售前30分钟您将收到短信提醒</p>
    </div>
    <div class="order-detail-list">
        <div class="order-detail-goods">
            <img :src="detail.spuImages" alt="" class="goods-img">
            <div class="goods-info">
                <h3 class="orderList-info-title">
                    {{detail.spuSubtitle}}{{detail.spuName}}
                </h3>
                <p class="orderList-info-subTitle">限量<span>{{detail.spuStock}}</span>份</p>
                <p class="info-text">{{detail.spuOriginalPrice?'￥'+detail.spuOriginalPrice:'免费'}}</p>
            </div>
        </div>
        <div class="order-detail-menu">
            <div class="order-detail-item">
                <span>发售时间</span>
                <p>{{setTime(detail.startTime,'yyyy-mm-dd hh:mm')}}</p>
            </div>
            <div class="order-detail-item">
                <span>距离开售时间</span>
                <p v-html="countDownBtn"></p>
            </div>
        </div>
    </div>
    <div class="foot-box">
        <button class="canle" @click="subWechatKefuCallBack">微信客服</button>
        <button class="comipte" @click="addLink">返回</button>
    </div>
    <div class="info-box">
        <p>如有任何疑问，请联系我们的客服</p>
        <p>
            <i class="iconfont icon-24gl-phoneLoudspeaker"></i>客服电话<a href="tel:02136696098-8125">02136696098-8125</a>
        </p>
    </div>
</div>
</template>

<script>
import {
    bookDetail
} from '@/assets/api/gateway';
import encrypt from "@/utils/encrypt.js";
export default {
    name: 'cultureSubscribe',
    data() {
        return {
            detail: {},
            id: this.$route.query.id || '',
            countDownBtn: '',
            timer: null,
            countDown: 0,
            workLink: 'https://work.weixin.qq.com/kfid/kfc7625783dcdee8167'
        }
    },
    created() {
        this.getDetailList();
        window['ct_commonCallbackFromNative'] = (result, status) => {
            console.log(result, status, 'result, status')
            //result, status 参数对应的状态
            //"getUserInfo", "json" 用户数据
            //"wechatKefu", "json" 用户数据
            let data = JSON.parse(status) || {}
            if (result == "wechatKefu") {
                // this.subWechatKefuCallBack(data)
            }
        }
    },
    methods: {
        setTime(time, format, type) {
            return encrypt.transformation(time, format, type)
        },
        subWechatKefuCallBack(data) {
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
        addLink() {
            this.$router.go(-1);
        },
        handleDelayTimer() {
            clearInterval(this.timer);
            this.delayTimer();
            return this.timer = setInterval(() => {
                if (this.countDown <= 0) {
                    this.countDown = 0
                    clearInterval(this.timer);
                    return
                }
                this.countDown -= 1000;
                this.delayTimer()
            }, 1000)
        },
        delayTimer() {
            let startTime = this.detail.startTime;
            let curTime = this.detail.curTime;
            let mss = this.countDown || startTime - curTime; //毫秒差
            this.countDown = mss;
            if (this.countDown <= 0) {
                return this.countDownBtn = "现已开售"
            }
            var days = parseInt(mss / (1000 * 60 * 60 * 24));
            var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = parseInt((mss % (1000 * 60)) / 1000);
            if (hours < 10) {
                hours = '0' + hours;
            }
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            let newsDay = days ? `<span>${days}</span>天` : '';
            this.countDownBtn =
                `${newsDay}
                   <span>${hours}</span>时
                   <span>${minutes}</span>分
                   <span>${seconds}</span>秒
                `
        },
        getDetailList() {
            let obj = {
                supId: this.id,
                shopPath: this.$route.params.shopPath,
            };
            bookDetail(obj).then(res => {

                if (res.status != 200) {
                    return
                }
                this.detail = res.data || {};
                this.handleDelayTimer();
            })
        },
    },
    destroyed() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    filters: {

    }
}
</script>
<style lang="scss" scoped>
@import '../../styles/tiangong/subscribe.scss';
</style>
