<template>
<div class="culture-historyOrder-box">
    <List v-model="isLoading" :finished="finished" @load="getList">
        <div class="history-order-box" v-if="isListBool==1">
            <div class="history-order-menuItem" v-for="(item,index) in listData" :key="index">
                <div class="order-menuItem-top">
                    <div class="menuItem-top-dealDate">{{setTime(item.orderCreateTime,'yyyy-mm-dd hh:mm:ss','.')}}</div>
                    <div class="menuItem-top-status">{{item | handleStatus}}</div>
                </div>
                <div class="order-menuItem-content">
                    <div class="order-menuItem-border">
                        <img :src="item.spuImages" alt="" class="menuItem-content-img">
                        <div class="menuItem-content-right">
                            <div class="menuItem-content-title">{{item.spuSubtitle}}{{item.spuName}}
                            </div>
                            <div v-if="item.orderType==1 || item.orderType==3">
                                <div class="menuItem-content-only only-price">{{item.price?'￥'+item.price:'免费'}}</div>
                            </div>
                             <div class="menuItem-content-only">{{setType(item.orderType) && setType(item.orderType).name}} {{item.buyCount}} 份</div>
                        </div>
                    </div>
                </div>
                <div class="order-menuItem-bottom">
                    <div v-if="item.orderType==1 || item.orderType==3">
                        <div class="menuItem-bottom-info">
                            <div class="menuItem-bottom-right">交易金额</div>
                            <div class="menuItem-bottom-right">{{item.totalPrice?item.totalPrice +'元':'免费'}}</div>
                        </div>
                        <div :class="['menuItem-bottom-info menuItem-bottom-haxi',{'warp-menuItem-box':item.seriesNoList.length>3 && item.bool,'nowarp-menuItem-box':item.seriesNoList.length>3 && !item.bool}]">
                            <div class="menuItem-bottom-left">{{setType(item.orderType) && setType(item.orderType).num}}<i @click="addCheck(item)" :class="['iconfont',{'icon-arrowBottom':item.seriesNoList.length>3,'active-icon':item.seriesNoList.length>3 && item.bool}]"></i></div>
                            <div class="menuItem-bottom-right">
                                <span v-for="(ele,e) in item.seriesNoList" :key="e">编码：{{ele}}</span>
                            </div>
                        </div>
                        <div class="menuItem-bottom-info" v-if="item.orderType==1 && item.totalPrice || item.orderType!=1">
                            <div class="menuItem-bottom-right">{{setType(item.orderType) && setType(item.orderType).time}}</div>
                            <div class="menuItem-bottom-right">{{item | setOrderTime}}</div>
                        </div>
                    </div>
                    <div v-else-if="item.orderType==2">
                        <div :class="['menuItem-bottom-info menuItem-bottom-haxi',{'warp-menuItem-box':item.seriesNoList.length>3 && item.bool,'nowarp-menuItem-box':item.seriesNoList.length>3 && !item.bool}]">
                            <div class="menuItem-bottom-left">{{setType(item.orderType) && setType(item.orderType).num}}<i @click="addCheck(item)" :class="['iconfont',{'icon-arrowBottom':item.seriesNoList.length>3,'active-icon':item.seriesNoList.length>3 && item.bool}]"></i></div>
                            <div class="menuItem-bottom-right">
                                <span v-for="(ele,e) in item.seriesNoList" :key="e">编码：{{ele}}</span>
                            </div>
                        </div>
                        <div class="menuItem-bottom-info">
                            <div class="menuItem-bottom-right">{{item.transferMode==1?'接收者':'转赠者'}}</div>
                            <div class="menuItem-bottom-right">{{item.transferMode==1?item.userName || sub(item.userMobileNo,3,4,4):item.fromUserName || sub(item.fromMobileNo,3,4,4)}}</div>
                        </div>
                        <div class="menuItem-bottom-info">
                            <div class="menuItem-bottom-right">转赠时间</div>
                            <div class="menuItem-bottom-right">{{item.transferStartTime}}</div>
                        </div>
                        <div class="menuItem-bottom-info">
                            <div class="menuItem-bottom-right">接收时间</div>
                            <div class="menuItem-bottom-right">{{item.transferReceiveTime}}</div>
                        </div>
                    </div>
                    <div class="menuItem-bottom-info">
                        <div class="menuItem-bottom-right">记录单号</div>
                        <div class="menuItem-bottom-right">{{item | setOrderNum}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mycollection-noList" v-else-if="isListBool==2"><i class="iconfont icon-queshengye-zanwujilu"></i>暂无相关流转记录</div>
    </List>
    <div class="load-all-box" v-if="listData.length">— 已显示全部记录 —</div>
</div>
</template>

<script>
import {
    myRecordList,
    orderCancel
} from '@/assets/api/gateway';
import {
    List
} from 'vant';
import encrypt from "@/utils/encrypt.js";
export default {
    name: 'cultureHistoryOrder',
    components: {
        List,
    },
    data() {
        return {
            user: {},
            filterParams: {
                page: 1,
                rows: 10,
                end: false, //页面最底
            },
            isLoading: false,
            listData: [],
            isLoading: false,
            finished: false,
            isListBool: false,
        }
    },
    methods: {
        setType(val) {
            let obj = {
                1: {
                    name: '已购',
                    time: '交易时间',
                    num: '购买编号'
                },
                 2: {
                    name: '数量',
                    num: '藏品编号'
                },
                3: {
                    name: '空投',
                    time: '空投时间',
                    num: '空投编号'
                }
            }
            return obj[val];
        },
        sub(str, startLength, endLength, num) {
            return encrypt.subText(str, startLength, endLength, num)
        },
        setTime(time, format, type) {
            return encrypt.transformation(time, format, type)
        },
        addCheck(el) {
            if (el.seriesNoList.length > 3) {
                el.bool = !el.bool;
            }
        },
        getList() {
            let obj = {
                shopPath: this.$route.params.shopPath,
                page: this.filterParams.page,
                rows: this.filterParams.rows
            }
            // fromNftUserId=userId，是这个人的转赠
            // nftUserId=userId，是购买
            myRecordList(obj).then(res => {

                if (res.status != 200) {
                    this.isListBool = 2;
                    return this.finished = true;
                }
                let data = res.data || [];
                if (!data.length && !this.listData.length) {
                    this.isListBool = 2;
                    this.isLoading = false;
                    this.finished = true;
                } else {
                    this.isListBool = 1;
                    data = data.map(ele => {
                        ele.bool = false;
                        return ele;
                    });
                    this.push(data)
                    if (data.length == this.filterParams.rows) {
                        this.isLoading = true;
                        this.filterParams.page += 1
                        this.finished = false;
                        this.getList();
                    } else {
                        this.finished = true;
                    }

                }
            });
        },
        push(arr) {
            this.listData.push.apply(this.listData, arr);
        },
    },
    filters: {
        setOrderTime({
            orderType,
            createTime,
            orderCreateTime
        }) {
            let obj = {
                1: createTime,
                3: orderCreateTime
            }
            return obj[orderType]
        },
        setOrderNum({
            orderType,
            orderNum,
            transferOrderNum
        }) {
            let obj = {
                1: orderNum,
                2: transferOrderNum,
                3: orderNum
            }
            return obj[orderType]
        },
        handleStatus({
            state,
            transferMode,
            orderType
        }) {
            if (orderType == 1 || orderType == 3) {
                const stateTypeObj = {
                    1: '交易成功',
                    2: '待付款',
                    4: '已付款',
                    6: '已取消',
                    0: '交易成功',
                }
                if (orderType == 3) {
                    return '空投成功'
                }
                return stateTypeObj[state]
            } else if (orderType == 2) {
                if (transferMode == 1) {
                    return '转赠成功'
                } else if (transferMode == 2) {
                    return '接收成功'
                }
            }

        },
        getPrice({
            skuPayMethod,
            price
        }) {
            // skuPayMethod 支付方式（0——无需支付，1——人民币，2——纯积分，3——人民币+积分）',
            const payTypeObj = {
                0: '免费',
                1: `￥${price ? price.toFixed(2) : '0.00'}元`
            }
            return payTypeObj[skuPayMethod]
        }
    },
}
</script>

<style lang="scss">
@import '../../styles/tiangong/commen.scss';
@import '../../styles/tiangong/history-order.scss';
</style>
