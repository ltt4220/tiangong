<template>
<div class="confirmExamplesLoading-content-tt">
     <div class="pop-box"></div>
    <h3 class="confirmExamplesLoading-title-tt">
        <i class="iconfont icon-ARROW-left-copy" @click="goHome"></i>
        <i class="iconfont icon-7"></i>
        <span class="title-box">转赠中</span>
        <span class="title-info">{{setTime(detail.transferRefuseTime,'yyyy-mm-dd hh:mm')}} 前对方未领取，将退还给你</span>
    </h3>
    <div class="confirmExamplesLoading-detail">
        <div class="confirmExamplesLoading-detail-top">
            <img alt="" class="confirmExamplesLoading-img" :src="detail.spuImages">
            <div class="confirmExamplesLoading-info">
                <h3 class="confirmExamplesLoading-info-title">{{detail.spuSubtitle}}{{detail.spuName}}</h3>
                <p class="confirmExamplesLoading-info-subTitle">{{detail.spuProduce}}</p>
                <p class="confirmExamplesLoading-info-subTitle">当前拥有者：{{detail.userName || sub(detail.userMobileNo,3,4,4)}}</p>
                <p class="confirmExamplesLoading-info-subTitle">数量 {{detail.seriesNoList && detail.seriesNoList.length}} 份</p>
            </div>
        </div>
        <div :class="['menuItem-bottom-info menuItem-bottom-haxi',{'warp-menuItem-box':detail.seriesNoList && detail.seriesNoList.length>3 && isCheck,'nowarp-menuItem-box':detail.seriesNoList && detail.seriesNoList.length>3 && !isCheck}]">
            <div class="menuItem-bottom-left">藏品编号<i @click="addCheck" :class="['iconfont',{'icon-arrowBottom':detail.seriesNoList && detail.seriesNoList.length>3,'active-icon': detail.seriesNoList && detail.seriesNoList.length>3 && isCheck}]"></i></div>
            <div class="menuItem-bottom-right">
                <span v-for="(ele,e) in detail.seriesNoList" :key="e">编码：{{ele}}</span>
            </div>
        </div>
    </div>
    <div class="confirmExamplesLoading-body">
        <ul class="confirmExamplesLoading-list">
            <li>
                <span class="ExamplesLoading-label">赠送内容</span>
                <p class="ExamplesLoading-time">{{detail.spuSubtitle}}{{detail.spuName}}</p>
            </li>
            <li>
                <span class="ExamplesLoading-label">转赠时间</span>
                <p class="ExamplesLoading-time">{{detail.transferStartTime}}</p>
            </li>
            <li>
                <span class="ExamplesLoading-label">订单编号</span>
                <p class="ExamplesLoading-time">{{detail.transferOrderNum}}</p>
            </li>
        </ul>
    </div>
    <div class="confirmExamplesLoading-btn">
        <button @click="addLink">完成</button>
    </div>
</div>
</template>

<script>
import {
    onTransferSpuInfo,
} from '@/assets/api/gateway';
import encrypt from '@/utils/encrypt.js';
export default {
    name: 'loadingConfirmExamples',
    data() {
        return {
            nftRecordId: this.$route.query.id || '',
            detail: {},
            orderNum: this.$route.query.orderNum || '',
            isCheck:false,
        }
    },
    created() {
        this.loadData();
    },
    methods: {
        addCheck(){
            this.isCheck = !this.isCheck;
        },
        sub(str, startLength, endLength, num) {
            return encrypt.subText(str, startLength, endLength, num)
        },
        addLink() {
            this.$router.push({
                name: 'cultureUserCenter'
            })
        },
        setTime(time, format, type) {
            return encrypt.transformation(time, format, type)
        },
        loadData() {
            let query = {
                shopPath: this.$route.params.shopPath,
                nftRecordId: this.nftRecordId,
                orderNum: this.orderNum
            }
            onTransferSpuInfo(query).then(res => {
                if (res.status != 200) return
                let data = res.data || {};
                this.detail = data;
                console.log(data, 'dssssssss')
            })
        },
        goHome() {
            this.$router.go(-1)
        },
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/tiangong/loadingConfirmExamples.scss';
</style>
