<template>
<div class="cultureUnderstand-box">
    <div v-if="detail && detail.infoCoverUrl">
        <img class="banner" :src="detail.infoCoverUrl">
        <div class="cultureUnderstand-body">
            <div class="content-box">
                <div class="detail-cont" v-html="detail.infoDetail"></div>
                <div class="time-box">
                    <span>发布时间&emsp;{{setTime(detail.updateTime,'yyyy-mm-dd','.')}}</span>
                    <span>阅读&emsp;{{detail.browseCount}}</span>
                </div>
                 <img src="http://culturecloud.oss-accelerate.aliyuncs.com/sh/202291511/qrcode.png" alt="" class="img-code">
                <img @click="subWechatKefuCallBack" src="http://culturecloud.oss-accelerate.aliyuncs.com/sh/202291511/kefu.png" alt="" class="kefu-box">
            </div>
        </div>
    </div>

</div>
</template>

<script>
import {
    WeChat
} from '@/plugins/mixin';
import {
    infoDetail
} from '@/assets/api/gateway';
import encrypt from "@/utils/encrypt.js"
export default {
    name: 'cultureTweets',
    mixins: [WeChat],
    data() {
        return {
            id: this.$route.query.id,
            detail: {},
            workLink: 'https://work.weixin.qq.com/kfid/kfc7625783dcdee8167'
        }
    },
    created() {
        this.loadInfoDetail();
    },
    methods: {
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
        setTime(time, format, type) {
            return encrypt.transformation(time, format, type)
        },
        loadInfoDetail() {
            let query = {
                infoId: this.id,
                shopPath: this.$route.params.shopPath,
            }
            infoDetail(query).then(res => {
                if (res.status != 200) return;
                let data = res.data || {};
                this.detail = data;
                this.publicShare({
                    shareTitle: this.detail.infoShareTitle,
                    shareImgUrl: this.detail.infoShareImage,
                    shareDesc: this.detail.infoShareDescription
                })
                console.log(data, 'dada')
            })
        }
    },
}
</script>

<style lang="scss">
* {
    padding: 0;
    margin: 0;
}

body,
html {
    background: #2c2c2c;
}

.cultureUnderstand-box {
    min-height: 100vh;
    width: 100%;
    background: #000000;

    .banner {
        width: 100%;
        height: 422px;
    }

    .cultureUnderstand-body {
        width: 100%;
        position: relative;
        padding: 0 36px;
        box-sizing: border-box;

        .content-box {
            background: #2c2c2c;
            border-radius: 16px;
            box-sizing: border-box;
            position: relative;
            top: -46px;
            padding: 46px 30px;
            box-sizing: border-box;

            .detail-cont {
                text-align: justify;
                font-size: 28px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #ffffff;
                line-height: 46px;
                word-break: break-all;

                p {
                    width: 100%;
                    text-align: justify;
                    line-height: 46px;
                    word-break: break-all;
                    text-indent: 2em;

                    span {
                        text-align: justify;
                        line-height: 46px;
                        word-break: break-all;
                    }

                    img {
                        display: block;
                        max-width: 100% !important;
                        margin: 50px auto;
                    }
                }

                img {
                    display: block;
                    max-width: 100% !important;
                    margin: 50px auto;
                }
            }

            .time-box {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 54px;
                font-size: 28px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #ffffff;
                line-height: 40px;
                padding-bottom: 34px;
                border-bottom: 2px solid #666;
            }

            .img-code {
                height: auto;
                margin: 94px auto 0;
                width: 80%;
                display: flex;
            }

            .kefu-box {
                margin: 40px auto;
                height: auto;
                margin-top: 40px;
                width: 80%;
                display: flex;
            }
        }
    }
}
</style>
