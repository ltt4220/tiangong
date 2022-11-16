<template>
<div class="certificate-detail-box">
    <div class="border-content">
        <div class="out-border">
            <div class="certificate-detail-banner">
                <img src="../../assets/images/tiangong/phone-logo.png" alt="" class="icon-msg">
                <p><span>区块链查证信息概览</span></p>
            </div>
            <!-- 产品信息 -->
            <div class="certificate-info-content">
                <div class="certificate-detail-info" @click.stop="addPackUp(0)">
                    <div class="certificate-detail-title">藏品信息<i :class="['iconfont icon-arrowBottom',{'active-icon':!imageStats.isInfo}]"></i></div>
                </div>
                <div v-show="imageStats.isInfo" class="product-list">
                    <div class="list-item">
                        <div class="list-name">作品名称</div>
                        <div class="list-content">{{detailData.spuSubtitle}}{{detailData.spuName}}</div>
                    </div>
                    <div class="list-item">
                        <div class="list-name">创作者</div>
                        <div class="list-content"> {{detailData.creatorName || ''}}
                        </div>
                    </div>
                    <div class="list-item">
                        <div class="list-name">持有人</div>
                        <div class="list-content"> {{detailList[0] && detailList[0].userName || sub(detailList[0] && detailList[0].userMobileNo,3,4,4)}}
                        </div>
                    </div>
                    <div class="list-item works-desc">
                        <div class="list-name">作品介绍</div>
                        <div class="list-content list-content-indent" v-html="handleText(detailData.spuSummary)">
                        </div>
                        <img src="../../assets/images/tiangong/certified.png" alt="" class="icon-goods-certified">
                    </div>
                </div>
            </div>
            <!-- 流转信息 -->
            <div class="certificate-info-content">
                <div class="certificate-detail-info" @click.stop="addPackUp(1)">
                    <div class="certificate-detail-title">流转信息<i :class="['iconfont icon-arrowBottom',{'active-icon':!imageStats.isProduct}]"></i></div>
                </div>
                <div v-show="imageStats.isProduct">
                    <div class="handle-list" v-for="(item,i) in detailList" :key="i">
                        <div class="item-title">{{item.userName || sub(item.userMobileNo,3,4,4)}}</div>
                        <div class="list-item">
                            <div class="list-name">流转类型</div>
                            <div class="list-content">{{setType(item.transferType) && setType(item.transferType).name}}</div>
                        </div>
                        <div class="list-item">
                            <div class="list-name">{{setType(item.transferType) && setType(item.transferType).time}}</div>
                            <div class="list-content">{{item.updateTime}}</div>
                        </div>
                        <div class="list-item">
                            <div class="list-name">{{setType(item.transferType) && setType(item.transferType).hash}}</div>
                            <div class="list-content">{{item.hash}}</div>
                        </div>
                    </div>
                    <div class="handle-certifi-foot">
                        <div class="item-title">{{detailData.spuProduce}}</div>
                        <div class="list-item">
                            <div class="list-name">发行时间</div>
                            <div class="list-content">{{detailData.spuCreateTime}}</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

</div>
</template>

<script>
import {
    nftRecordList
} from '@/assets/api/gateway';
import encrypt from '@/utils/encrypt.js';
export default {
    name: 'cultureCertificateDetail',
    data() {
        return {
            id: this.$route.query.id || '',
            nftContractId: this.$route.query.nftContractId || '',
            detailList: [],
            detailData: {},
            changeStartData: {},
            changeEndData: {},
            imageStats: {
                isInfo: true,
                isProduct: true
            },
            type: this.$route.query.type || '',
        }
    },
    mounted() {
        this.getlistata()
    },
    methods: {
        setType(val) {
            let obj = {
                1: {
                    name: '藏品发放',
                    time: '交易时间',
                    hash: '交易哈希'
                },
                2: {
                    name: '藏品转赠',
                    time: '流转时间',
                    hash: '流转哈希'
                },
                3: {
                    name: '藏品空投',
                    time: '交易时间',
                    hash: '交易哈希'
                }
            }
            return obj[val];
        },
        sub(str, startLength, endLength, num) {
            if (!str) return
            return encrypt.subText(str, startLength, endLength, num)
        },
        addPackUp(val) {
            if (val) {
                this.imageStats.isProduct = !this.imageStats.isProduct;
            } else {
                this.imageStats.isInfo = !this.imageStats.isInfo;
            }
        },
        // 流传信息
        getlistata() {
            const obj = {
                shopPath: this.$route.params.shopPath,
                spuId: this.id,
                nftContractId: this.nftContractId,
            };
            nftRecordList(obj).then(res => {

                if (res.status != 200) {
                    return
                }
                let data = res.data || {};
                this.detailList = data.recordList || [];
                this.detailData = data.virtualCommoditySpuVO || {};
            });
        },
        handleText(text) {
            let str = text || ''
            str = str.replace(/\n/g, '<br/>')
            return str
        },
    },
}
</script>

<style lang="scss">
@import '../../styles/tiangong/commen.scss';
@import '../../styles/tiangong/certificate-detail.scss';
</style>
