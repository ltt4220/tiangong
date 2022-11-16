<template>
<div class="confirmExamples-content-tt">
    <h3 class="confirmExamples-title-tt">
        <i class="iconfont icon-ARROW-left-copy" @click="goHome"></i>
        接收转赠藏品
    </h3>
    <div class="confirmExamples-detail">
        <div class="confirmExamples-detail-top">
            <img alt="" class="confirmExamples-img" :src="detail.spuImages">
            <div class="confirmExamples-info">
                <h3 class="confirmExamples-info-title">{{detail.spuSubtitle}}{{detail.spuName}}</h3>
                <p class="confirmExamples-info-subTitle">{{detail.spuProduce}}</p>
                <p class="confirmExamples-info-subTitle">当前拥有者：{{detail.userName || sub(detail.userMobileNo,3,4,4)}}</p>
                <p class="confirmExamples-info-subTitle">数量 {{detail.seriesNoList && detail.seriesNoList.length}} 份</p>
            </div>
        </div>
        <div :class="['menuItem-bottom-info menuItem-bottom-haxi',{'warp-menuItem-box':detail.seriesNoList && detail.seriesNoList.length>3 && isCheck,'nowarp-menuItem-box':detail.seriesNoList && detail.seriesNoList.length>3 && !isCheck}]">
            <div class="menuItem-bottom-left">藏品编号<i @click="addCheck" :class="['iconfont',{'icon-arrowBottom':detail.seriesNoList && detail.seriesNoList.length>3,'active-icon': detail.seriesNoList && detail.seriesNoList.length>3 && isCheck}]"></i></div>
            <div class="menuItem-bottom-right">
                <span v-for="(ele,e) in detail.seriesNoList" :key="e">编码：{{ele}}</span>
            </div>
        </div>
    </div>
    <div class="confirmExamples-body">
        <p class="confirmExamples-tishi-tt">温馨提示，接收本数字藏品即代表同意以下条件：</p>
        <ul class="confirmExamples-list">
            <li>我们不支持任何形式的有偿转赠，请警惕欺诈风险。一旦发现异常行为，我们会对相关帐户采取限制措施。</li>
        </ul>
    </div>
    <div class="confirmExamples-btn receiveExamples-btn">
        <p class="confirmExamples-text">{{setTime(detail.transferRefuseTime,'yyyy-mm-dd hh:mm')}}前未收下，将退还给对方</p>
        <div class="receive-Examples-btn">
            <button @click="addReceiveOrBackSpu('refuse')">退回</button>
            <button @click="addReceiveOrBackSpu('receive')">收下</button>
        </div>

    </div>
</div>
</template>

<script>
import {
    receiverSpuInfo,
    receiveOrBackSpu
} from '@/assets/api/gateway';
import encrypt from '@/utils/encrypt.js';
import {
    Toast
} from 'vant';
import 'vant/es/toast/style';
export default {
    name: 'receiveExamples',
    data() {
        return {
            id: this.$route.query.id || '',
            detail: {},
            isCheck:false
        }
    },
    created() {
        this.addReceiverSpuInfo();
    },
    methods: {
        addCheck() {
            this.isCheck = !this.isCheck;
        },
        sub(str, startLength, endLength, num) {
            return encrypt.subText(str, startLength, endLength, num)
        },
        setTime(time, format, type) {
            return encrypt.transformation(time, format, type)
        },
        addReceiveOrBackSpu(status) {
            let query = {
                status,
                transferId: this.id,
                nftRecordId: this.detail.nftRecordId,
                shopPath: this.$route.params.shopPath,
            }
            receiveOrBackSpu(query).then(res => {
                if (res.status != 200) {
                    return Toast({
                        message: res.errMsg,
                        icon: 'fail'
                    });
                };
                let name = "";
                let query = {};
                if (status == 'refuse') {
                    name = "cultureUserCenter"
                } else {
                    name = "receiveConfirmExamples"
                    query = {
                        id: this.id
                    }
                }
                this.$router.push({
                    name,
                    query
                })
            })
        },
        addReceiverSpuInfo() {
            let query = {
                transferId: this.id,
                shopPath: this.$route.params.shopPath,
            }
            receiverSpuInfo(query).then(res => {
                if (res.status != 200) return
                let data = res.data || {};
                this.detail = data;
                console.log(this.detail, "ddddddddddd")
            })
        },
        goHome() {
            this.$router.go(-1)
        },
    }
}
</script>

<style lang="scss">
@import '../../styles/tiangong/commen.scss';
</style><style lang="scss" scoped>
@import '../../styles/tiangong/confirmExamples.scss';
</style>
