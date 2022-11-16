<template>
<div class="culture-order-box">
    <div v-if="isload" class="loading-box-ordercont"> <img src="../../assets/images/culture-gather/load.gif" alt="" class="loading-common"></div>
    <div v-else>
        <!-- 订单状态 -->
        <div class="tabs-list">
            <div :class="['tabs-item',{'tabActive':activeItem==index}]" v-for="(item,index) in tabList" :key="index" @click="changeTab(index)">
                {{item.name}}</div>
        </div>
        <!-- 订单列表 -->
        <List v-model="isLoading" :finished="finished" @load="getOrderList">
            <div class="culture-orderList-box" v-if="isListBool==1">
                <div :class="['culture-orderList-content',{'culture-orderList-topay':item.state && (item.state == 2||item.state ==3||item.state == 4)}]" @click="goLink(item.id)" v-for="(item,index) in orderList" :key="index">
                    <div class="orderList-top">
                        <div>{{setTime(item.createTime,'yyyy-mm-dd','.')}}</div>
                        <!-- state| 订单状态 1:交易成功，2:待付款，3:待生成，4:生成完，5:待评价，6:取消，7:订单支付超时 | -->
                        <div :class="['orderList-status',getBtnClass(item)]">{{item | handleStatus}}</div>
                    </div>
                    <div class="orderList-content-bottom" v-if="item.details&&item.details[0]">
                        <img :src="item.details[0].skuImage" alt="" class="orderList-content-img">
                        <div class="orderList-info">
                            <div class="orderList-info-title">{{item.spuSubtitle}}{{item.details[0].spuName}}</div>
                            <div class="orderList-info-subTitle">
                                {{item.spuProduce?item.spuProduce:''}}</div>
                            <div class="orderList-info-price">
                                <div>{{item.details[0] | getPrice}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="foot-box">
                        <div class="info-box">
                            <span>购买：{{item.commodityNum}}份</span>
                            <p>合计：<i>￥</i><span>{{item.totalMoney?item.totalMoney:'免费'}}</span></p>
                        </div>
                        <div class="to-pay" v-if="item.state && (item.state == 2||item.state ==3||item.state == 4)">
                            去付款
                        </div>

                    </div>
                </div>
            </div>
            <div class="mycollection-noList" v-else-if="isListBool==2"><i class="iconfont icon-jiluqueshengshuxing"></i> 暂无相关的订单 </div>
        </List>
        <!-- 没有更多订单 -->
        <div class="no-more-order" v-if="orderList.length">— 没有更多订单了 —</div>
    </div>
</div>
</template>

<script>
import {
    orderList
} from '@/assets/api/gateway';
import encrypt from "@/utils/encrypt.js";
import {
    List
} from 'vant';
import {
    qs
} from '@/utils/auth.js';
export default {
    name: 'cultureOrder',
    components: {
        List,
    },
    data() {
        return {
            tabList: [{
                    name: '全部',
                    value: '0'
                },
                {
                    name: '待付款',
                    value: '1'
                },
                {
                    name: '已付款',
                    value: '2'
                },
                {
                    name: '已取消',
                    value: '3'
                }
            ],
            activeItem: 0,
            orderList: [],
            filterParams: {
                page: 1,
                rows: 8,
                end: false, //页面最底
            },
            isLoading: false,
            finished: false,
            shownoMore: false,
            changeTabs: {},
            isListBool: false,
            isload: qs('load') || '',
            timerOuter: null,
        }
    },
    created() {
        if (this.isload) {
            this.timerOuter = setTimeout(() => {
                this.getOrderList();
            }, 2000)
        }
    },
    destroyed() {
        if (this.timerOuter) {
            this.timerOuter = null;
            clearTimeout(this.timerOuter)
        }

    },
    methods: {
        setTime(time, format, type) {
            return encrypt.transformation(time, format, type)
        },
        getOrderList() {
            let obj = {
                shopPath: this.$route.params.shopPath,
                page: this.filterParams.page,
                rows: this.filterParams.rows,
                ...this.changeTabs
            };
            orderList(obj).then(res => {
                this.isload = false;
                if (res.status != 200) {
                    this.isListBool = 2;
                    return this.finished = true;
                }
                let data = res.data || [];
                if (!data.length && !this.orderList.length) {
                    this.isListBool = 2;
                    this.isLoading = false;
                    this.finished = true;
                } else {
                    this.isListBool = 1;
                    this.push(data);
                    if (data.length == this.filterParams.rows) {
                        this.isLoading = true;
                        this.filterParams.page += 1
                        this.finished = false;
                        this.getOrderList();
                    } else {
                        this.finished = true;
                    }

                }
            })
        },
        push(arr) {
            this.orderList.push.apply(this.orderList, arr);
        },
        changeTab(index) {
            console.log(index, 'uindex.')
            // 取消：stateList：[6,7]
            // 已付款state=1
            this.activeItem = index
            let _state = {
                1: {
                    state: 2
                },
                2: {
                    state: 1
                },
                3: {
                    stateList: [6, 7]
                }
            }
            this.changeTabs = _state[index]
            this.filterParams = {
                page: 1,
                rows: 10,
                end: false, //页面最底
            }
            // if (index == 0) {
            this.getOrderList()
            this.orderList = []
            // } else {
            //     this.orderList = []
            // }

        },
        goLink(id) {
            this.$router.push({
                name: 'cultureDetail',
                query: {
                    id
                }
            })
        },
        getBtnClass({
            state
        }) {
            const stateTypeObj = {
                1: 'orderList-status-success',
                2: 'orderList-status-pay',
                4: 'orderList-status-success',
                6: 'orderList-status'
            }
            return stateTypeObj[state]
        }
    },
    filters: {
        handleStatus({
            state,
            orderType
        }) {
            const stateTypeObj = {
                1: '交易成功',
                2: '待付款...',
                4: '已付款',
                6: '已取消',
                7: '已取消',
            }
            if (orderType == 3) {
                return state==1?'空投成功':'空投失败'
            } else {
                return stateTypeObj[state]
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
    }
}
</script>

<style lang="scss">
@import '../../styles/tiangong/commen.scss';
@import '../../styles/tiangong/order.scss';
</style>
