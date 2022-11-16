<template>
<div class="submit-order-box">
    <div class="head-box">
        <img :src="detail.spuImages" alt="" class="imgs">
        <h3 class="title">{{detail.spuName}}</h3>
        <p class="label">{{detail.spuSubtitle}}</p>
    </div>
    <ul class="body-box">
        <li>
            <span class="label">金额</span>
            <p class="info-box" v-if="detail.spuPayMethod"><i class="price">￥</i>{{detail.spuOriginalPrice}}</p>
            <p class="info-box" v-else>免费</p>
        </li>
        <li>
            <span class="label">数量</span>
            <div class="info-box">
                <div class="van-stepper">
                    <button type="button" @click="addNumber(0)" class="van-stepper__minus">-</button>
                    <input type="text" class="van-stepper__input" @focus="addFocus" v-model="value" @input="addChange" />
                    <button type="button" @click="addNumber(1)" class="van-stepper__plus">+</button>
                </div>
            </div>
        </li>
        <li class="item-box" v-if="detail.spuPayMethod">
            <span class="label">合计</span>
            <p class="info-box active-box"><i class="price">￥</i>{{setPirce}}</p>
        </li>
        <li>注：同一用户限购{{detail.stockAmount}}份。</li>
    </ul>
    <div class="footer-box">
        <button @click="goBuy(detail)">提交订单</button>
    </div>
    <pubilcPopBox :iscallback="iscallback" :iscanle="iscanle" :content="errContent" :ispopshow="ispopshow" @callback="callback">
    </pubilcPopBox>
</div>
</template>

<script>
import pubilcPopBox from '@/components/culture-gather/public-pop-box';
import {
    stayOrder,
    orderAdd,
} from '@/assets/api/gateway';
import {
    WeChat
} from '@/plugins/mixin';
import {
    is_weixin
} from '@/utils/index';
export default {
    name: 'cultureSubmitBox',
    components: {
        pubilcPopBox
    },
    mixins: [WeChat],
    data() {
        return {
            id: this.$route.query.id || '',
            detail: {},
            value: 1,
            user: {},
            ispopshow: false,
            errContent: '',
            iscanle: false,
            iscallback: () => {},
            isOrderShow: true,
            valDom: null,
            isMembers: this.$route.query.isMembers || 0,
            orderId: ""
        }
    },
    created() {
        this.loadDetail();
        // 将ct_commonCallbackFromNative方法绑定到window下面，提供给外部调用
        window['ct_commonCallbackFromNative'] = (result, status) => {
            console.log(result, status, 'result, status')
            //result, status 参数对应的状态
            //"appPay", "success" 支付成功
            //"appPay", "fail" 支付失败
            //"appPay", "cancel" 支付取消
            if (result == "appPay") {
                this.subscanOrderCallBack()
            }

        }
    },
    computed: {
        setPirce() {
            let cont = Number(this.value) * Number(this.detail.spuOriginalPrice);
            return cont.toFixed(2);
        },
    },
    methods: {
        appPay() {
            if (typeof window.whySDK == 'object' && typeof whySDK.appPay == 'function') { //app
                var data = {
                    "orderId": this.orderId, // 订单ID
                    "orderType": 7, // 订单类型：0-活动、1-商品、7-NFT
                    "payMethod": "wechat" // 支付方式：wechat、alipay
                };
                whySDK.appPay(JSON.stringify(data));
            } else {
                let _url = `${window.location.protocol}//${this.$config.baseShopPath}/${this.$route.params.shopPath}/tiangong/orderDetail?id=${this.orderId}&tagType=detail` //订单详情页
                if (is_weixin()) { //微信
                    var url = `%s/wechat/%s_%s/getOpenId.do?callback=`;
                    url = this.format(url, 'http://china.wenhuayun.cn', this.$config.shopProvince, this.$route.params.shopPath); //当前站点
                    url += encodeURIComponent(`${this.$config.payUrl}/sh_sh/wxpayoverlay.html?type=7&id=${this.orderId}&url=${encodeURIComponent(_url)}`);
                    return window.location.href = url;
                } else { //浏览器
                    _url += '&load=1';
                    this.publicShare({
                        id: this.orderId,
                        url: _url
                    }, false)
                }

            }
        },
        subscanOrderCallBack() {
            this.$router.push({
                name: 'cultureDetail',
                query: {
                    id: this.orderId
                }
            })
        },
        addFocus(event) {
            event.target.select();
        },
        addChange() {
            let reg = /^[1-9]\d*$/;
            if (reg.test(this.value)) {
                if (this.value > Number(this.detail.stockAmount)) {
                    this.value = this.detail.stockAmount;
                }
            } else {
                this.value = ""
            }
        },
        addNumber(val) {
            if (val) {
                if (this.value < Number(this.detail.stockAmount)) {
                    this.value += 1
                }

            } else {
                if (this.value > 1) {
                    this.value -= 1
                }
            }
        },
        callback(el) {
            if (el) {
                this.iscallback();
            }
            this.ispopshow = false;
            this.iscallback = () => {};
        },
        loadDetail() {
            let query = {
                spuId: this.id,
                shopPath: this.$route.params.shopPath,
            }
            stayOrder(query).then(res => {
                if (res.status != 200) {
                    this.ispopshow = true;
                    return this.errContent = res.errMsg;
                }
                let data = res.data || {};
                this.detail = data;
                this.$nextTick(() => {
                    let dom = document.querySelector('.van-stepper__input');
                    this.valDom = dom;
                })
                console.log(data)
            })
        },
        // 去购买
        goBuy(detail) {
            this.getOrderAdd(detail);
        },
        getOrderAdd(detail) {
            // 判断是否登录
            // 免费下单
            if (this.isOrderShow) {
                let obj = {
                    skuVOS: [{
                        spuId: detail.spuId,
                        amount: this.value
                    }],
                    isMembers: this.isMembers,
                    shopPath: this.$route.params.shopPath,
                }
                this.isOrderShow = false;
                orderAdd(obj).then(res => {

                    if (res.status != 200) {
                        this.isOrderShow = true;
                        this.ispopshow = true;
                        return this.errContent = res.errMsg;
                    }

                    let data = res.data || {};
                    this.orderId = data.orderId;
                    // spuPayMethod 支付方式（ 0—— 无需支付， 1—— 人民币， 2—— 纯积分， 3—— 人民币 + 积分）
                    // orderStatus订单状态 1:交易成功，2:待付款，3:待发货，4:待收货，5:待评价，6:取消，7:订单支付超时'
                    if (detail.spuPayMethod === 0 && data.orderStatus === 1) {
                        this.$router.push({
                            name: 'cultureOrder',
                            query: {
                                id: data.orderId
                            }
                        })
                    } else if (detail.spuPayMethod === 1 && data.orderStatus === 2) {
                        // orderType = 7 代表nft支付
                        this.appPay()
                    }
                });
            }
        },
        format(f) {
            var formatRegExp = /%[s]/g; //加入g会循环执行
            if (typeof f !== 'string') throw new Error('format(f),the f data type must be string.');
            var i = 1;
            var args = [];
            [].push.apply(args, arguments);
            var len = args.length;
            var str = f.replace(formatRegExp, function (x) {
                if (i >= len) return x;
                return args[i++];
            });
            return str;
        },
    },
}
</script>

<style lang="scss">
@import '../../styles/tiangong/commen.scss';
@import '../../styles/tiangong/submitOrder.scss';
</style>
