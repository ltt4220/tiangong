<template>
<div class="culture-orderDetail-box">
    <div v-if="isLoading" class="loading-box-ordercont"> <img src="../../assets/images/culture-gather/load.gif" alt="" class="loading-common"></div>
    <div v-else>
        <div class="order-detail-status">
            <!-- |state| 订单状态 1:交易成功，2:待付款，3:待生成，4:生成完，5:待评价，6:取消，7:订单支付超时 | -->
            <div>
                <i :class="detailList.state | setClass"></i>
                <p>{{detailList | setStatus}}</p>
                <div class="countdown" v-show="detailList.state==2">支付剩余时间<span>{{countDown | handleTime}}</span></div>
            </div>
        </div>
        <div class="order-detail-list">
            <div class="order-detail-goods">
                <img :src="detailData.skuImage" alt="" class="goods-img">
                <div class="goods-info">
                    <h3 class="orderList-info-title">{{detailList.spuSubtitle}}{{detailData.spuName}}</h3>
                    <p class="orderList-info-subTitle">{{detailList.spuProduce?detailList.spuProduce:''}}</p>
                    <p class="orderList-info-title">{{detailData | getPrice}}</p>
                </div>
            </div>
            <div class="order-detail-menu">
                <div class="order-detail-item">
                    <span>订单金额</span>
                    <p :class="{'stateActie':detailList.state == 2}">{{detailList.totalMoney?detailList.totalMoney+'元':'免费'}}</p>
                </div>
                <div class="order-detail-item">
                    <span>{{setType(detailList.orderType) && setType(detailList.orderType).name}}</span>
                    <p>{{detailList.commodityNum}}</p>
                </div>
                <div class="order-detail-item">
                    <span>{{setType(detailList.orderType) && setType(detailList.orderType).time}}</span>
                    <p>{{detailList.createTime}}</p>
                </div>
                <div class="order-detail-item" v-if="detailList.cancelTime">
                    <span>取消时间</span>
                    <p>{{detailList.cancelTime}}</p>
                </div>
                <div class="order-detail-item" v-if="detailList.state == 1 && detailList.totalPrice">
                    <span>付款时间</span>
                    <p>{{detailList.payTime}}</p>
                </div>
                <div class="order-detail-item">
                    <span>订单编号</span>
                    <p>{{detailList.orderNum}}</p>
                </div>
                <div class="order-detail-item" v-if="detailList.state == 1 && detailList.totalPrice">
                    <span>交易单号</span>
                    <p class="order-detail-oddNum">{{detailList.payTransactionNum}}</p>
                </div>
            </div>
        </div>
        <!-- 待付款 -->
        <div class="order-button">
            <div :class="['cancelOrder',{'width-cancelOrder':detailList.state == 6||detailList.state == 7}]" @click="cancelOrder">{{detailList.state == 2?'取消订单':'回首页'}}</div>
            <div class="payOrder" @click="toPay" v-show="detailList.state == 2 || detailList.state == 1">{{detailList.state == 2?'去付款':'个人中心'}}</div>
        </div>
        <pubilcPopBox :iscallback="iscallback" :iscanle="iscanle" :content="errContent" :ispopshow="ispopshow" @callback="callback" @addcanle="addcanle">
        </pubilcPopBox>
    </div>

</div>
</template>

<script>
import {
    orderDetail,
    orderCancel
} from '@/assets/api/gateway';
import {
    WeChat
} from '@/plugins/mixin';
import {
    is_weixin
} from '@/utils/index';
import {
    qs
} from '@/utils/auth.js';
import pubilcPopBox from '@/components/culture-gather/public-pop-box';
export default {
    name: 'cultureDetail',
    components: {
        pubilcPopBox,
    },
    mixins: [WeChat],
    data() {
        return {
            detailList: {},
            detailData: {},
            id: this.$route.query.id || '',
            countDown: '',
            createTime: '',
            timer: null,
            ispopshow: false,
            errContent: '',
            iscanle: false,
            iscallback: () => {},
            isLoading: qs('load') || '',
            timerOuter: null,
        }
    },
    beforeRouteLeave(to, from, next) {
        let url = qs('detail') && qs('detail') != '';
        if (to.query.tagType == 'detail' || url) {
            next({
                name: 'cultureGatherDetail',
                query: {
                    id: this.detailData.spuId
                }
            })
        }
        next()
    },
    created() {
        if (this.isLoading) {
            this.timerOuter = setTimeout(() => {
                this.getDetailList();
            }, 2000)
        } else {
            this.getDetailList();
        }

        // 将ct_commonCallbackFromNative方法绑定到window下面，提供给外部调用
        window['ct_commonCallbackFromNative'] = (result, status) => {
            //result, status 参数对应的状态
            //"appPay", "success" 支付成功
            //"appPay", "fail" 支付失败
            //"appPay", "cancel" 支付取消
            if (result == "appPay") {
                this.subscanOrderCallBack()
            }

        }
    },
    destroyed() {
        if (this.timer || this.timerOuter) {
            this.timer = null;
            this.timerOuter = null;
            this.timerOuter && clearTimeout(this.timerOuter)
            this.timer && clearInterval(this.timer);
        }

    },
    methods: {
        setType(val) {
            let obj = {
                1: {
                    name: '藏品份数',
                    time: '创建时间',
                },
                3: {
                    name: '空投份数',
                    time: '空投时间',
                }
            }
            return obj[val];
        },
        subscanOrderCallBack() {
            this.$router.push({
                name: 'cultureOrder',
                query: {
                    id: this.orderId
                }
            })
        },
        addcanle() {
            this.iscanle = false;
            this.ispopshow = false;
        },
        callback(el) {
            if (el) {
                this.iscallback();
            }
            this.ispopshow = false;
            this.iscallback = () => {};
        },
        cancelOrder() {
            if (this.detailList.state == 2) {
                this.iscanle = true;
                this.ispopshow = true;
                this.errContent = '确认取消订单？';
                this.iscallback = () => {
                    this.addOrderCanle();
                };
            } else {
                this.$router.push({
                    name: 'cultureGatherIndex'
                });
            }

        },
        addOrderCanle() {
            let obj = {
                id: this.id,
                shopPath: this.$route.params.shopPath,
            }
            orderCancel(obj).then(res => {

                if (res.status != 200) {
                    return
                }
                this.$router.push({
                    name: 'cultureOrder'
                })
            });
        },
        appPay() {
            if (typeof window.whySDK == 'object' && typeof whySDK.appPay == 'function') {
                var data = {
                    "orderId": this.detailList.id, // 订单ID
                    "orderType": 7, // 订单类型：0-活动、1-商品、7-NFT
                    "payMethod": "wechat" // 支付方式：wechat、alipay
                };
                whySDK.appPay(JSON.stringify(data));
            } else {
                let _url = `${window.location.protocol}//${this.$config.baseShopPath}/${this.$route.params.shopPath}/tiangong/order?id=${this.detailList.id}` //订单详情页
                if (is_weixin()) { //微信
                    var url = `%s/wechat/%s_%s/getOpenId.do?callback=`;
                    url = this.format(url, 'http://china.wenhuayun.cn', this.$config.shopProvince, this.$route.params.shopPath); //当前站点
                    url += encodeURIComponent(`${this.$config.payUrl}/sh_sh/wxpayoverlay.html?type=7&id=${this.detailList.id}&url=${encodeURIComponent(_url)}`);
                    return window.location.href = url;
                } else { //浏览器
                    _url += '&load=1'
                    this.publicShare({
                        id: this.detailList.id,
                        url: _url
                    }, false)
                }

            }
        },
        toPay() {
            if (this.detailList.state === 2) {
                //orderType = 7 代表nft支付
                this.appPay();
            } else {
                this.$router.push({
                    name: 'cultureUserCenter'
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
        getDetailList() {
            let obj = {
                id: this.id,
                shopPath: this.$route.params.shopPath,
            };
            orderDetail(obj).then(res => {
                this.isLoading = false;
                if (res.status != 200) {
                    return
                }
                let params = res || {};
                if (params.status != 200) {
                    this.iscanle = false;
                    this.ispopshow = true;
                    return this.errContent = params.errMsg;
                }
                let data = params.data || {};
                if (data.currentDateTime || data.createTime) {
                    data.currentDateTime = this.transformation(data.currentDateTime);
                    data.createTimeOrder = this.transformation(data.createTime);
                }
                this.detailList = data;
                this.detailList.currentDateTime = this.detailList.currentDateTime / 1000;
                let obj = Object.assign({}, this.detailList)

                this.createTime = obj.createTimeOrder / 1000;
                if (data.details) {
                    this.detailData = data.details[0] || {}
                }
                if (this.detailList.state === 2) {
                    this.getCountDown();
                    this.timer = setInterval(function () {
                        this.getCountDown();
                    }.bind(this), 1000)
                }
            })
        },
        transformation(time) {
            if (String(time).indexOf('-') > -1) {
                time = time.replace(/\-/gi, '/');
            }
            return Date.parse(new Date(time));
        },
        getCountDown() {
            //待付款倒计时
            this.countDown = 3 * 60 - this.detailList.currentDateTime + this.createTime;
            if (this.countDown <= 0) {
                this.countDown = 0;
                window.location.href = location.href
                clearInterval(this.timer)
                this.timer = null
                return null
            }
            this.detailList.currentDateTime += 1;
        }
    },
    filters: {
        setClass(val) {
            let obj = {
                '1': 'iconfont status-img icon-sucess',
                '2': 'iconfont status-img icon-pay',
                '6': 'iconfont status-img icon-chahao',
                '7': 'iconfont status-img icon-chahao',
            }
            return obj[val];
        },
        setStatus(val) {
            let obj = {
                '1': '交易成功',
                '2': '待付款...',
                '6': '交易取消',
                '7': '交易取消',
            }
            if (!val.totalMoney && val.state == 1 && val.orderType!=3) {//免费
                obj[1] = '领取成功';
            }else if(val.orderType==3){
                 obj[1] = '空投成功';
            }
            return obj[val.state];
        },
        getPrice({
            skuPayMethod,
            price
        }) {
            const payTypeObj = {
                0: '免费',
                1: `￥${price ? price.toFixed(2) : '0.00'}元`
            }
            return payTypeObj[skuPayMethod]
        },
        handleTime(val) {
            val = val || 0;
            if (!val) return;
            var m = parseInt(val / 60);
            m = m.toString();
            if (m.length == 1) m = '0' + m;
            var s = parseInt(val % 60);
            s = s.toString();
            if (s.length == 1) s = '0' + s;
            return m + ':' + s;
        },

    }
}
</script>

<style lang="scss">
@import '../../styles/tiangong/commen.scss';
@import '../../styles/tiangong/order-detail.scss';
</style>
