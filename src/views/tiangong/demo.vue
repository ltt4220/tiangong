<template>
<div>
    <div :class="['banner-box',{'cont-info':type==1 || type==3,'order-info':type==2}]">
        <div class="head-box" v-if="type!=2">
            <i @click="addLink" class="iconfont icon-ARROW-left-copy"></i>
            <img src="http://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/sh/sh/nftImage/202209291051373obd2e9xZImbK3w5nb1c_750_500.png" alt="" class="img1">
        </div>
        <div class="conten-box" v-if="type!=2">
            <div class="three-box" ref="threeBox">
                <img v-if="isLoading" src="../../assets/images/culture-gather/load.gif" alt="" class="loading-common">
            </div>
            <img src="http://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/sh/sh/nftImage/20220905183140iNrkfIqMFQXrn9j9GPFD_750_500.png" alt="" class="lable">
        </div>
        <div v-if="type==1" class="info-body isBackground" :style="{paddingTop:isSmallTop?'90px':'165px'}">
            <div class="info-box" :style="{paddingTop:isSmallTop?'40px':'50px'}">
                <div class="info-left">
                    <p class="text">这是测试3D模型的demo</p>
                    <h3>《测试3D模型这是测试3D模型》</h3>
                    <p class="type">3D · 3D测试</p>
                </div>
                <div class="info-right">
                    <span class="company">文化云</span>
                    <i class="iconfont icon-close"></i>
                    <span class="issue">3D测试</span>
                    <span class="limited">限量<i>1000</i>份</span>
                </div>
            </div>
        </div>
        <div class="mycollection-detail-banner" v-else-if="type==2">
            <div class="head-box">
                <i class="iconfont icon-ARROW-left-copy" @click="addLink"></i>
            </div>
            <div class="three-box" ref="threeBox">
                <img v-show="isLoading" src="../../assets/images/culture-gather/load.gif" alt="" class="loading-common">
            </div>
            <div class="info-body isBackground">
                <div class="item-content-right">
                    <i class="iconfont icon-fangda" @click="addLink"></i>
                </div>
            </div>
            <img src="https://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/20228414/sr.png?x-oss-process=image/resize,w_150,h_150" alt="" class="img2">
        </div>
        <div v-else-if="type==3">
            <detailVideo></detailVideo>
        </div>
        <div class="info-body" v-else-if="!type">
            <div class="info-box">
                <div class="info-left">
                    <p class="text">这是测试3D模型的demo</p>
                    <p class="type">上海创图网络科技股份有限公司</p>
                </div>
            </div>
        </div>
    </div>
    <div class="footer-box" v-if="type==1||type==3">
        <div class="tilp-box"><i class="iconfont icon-arrowDT"></i></div>
        <div class="button-left">
            <p class="price"><a><i class="lab">￥</i><span>0.01</span></a><a>库存<i class="big">1000</i>份</a></p>
        </div>
        <div class="button-right"><button><span>立即抢购</span></button>
        </div>
    </div>
</div>
</template>

<script>
import {
    qs
} from '@/utils/auth.js';
import detailVideo from '@/components/culture-gather/detail-video';
export default {
    name: 'demo',
    components: {
        detailVideo,
    },
    data() {
        return {
            isLoading: true,
            myviewwer: null,
            isSmallTop: false,
            type: qs('type') || '',
            url: qs('url') || 'https://culturecloud-nft.oss-cn-hangzhou.aliyuncs.com/sh/sh/sh/nftDemo/172-1_small(1).mview?OSSAccessKeyId=LTAI5tP56pNK2sPqrxBcNkbg&Expires=360000001662627840&Signature=y%2B9HJnCa5SJDv88fKAeHGxcapEM%3D'
        }
    },
    destroyed() {
        this.myviewwer.unload()
        document.body.removeChild(this.myviewwer.domRoot)
    },
    mounted() {
        let _height = document.documentElement.clientHeight || document.body.clientHeight;
        this.isSmallTop = _height && _height <= 1300;
        if (this.type == 1) {

            var height = this.type == 1 ? _height - 170 : 1236 - 170;
            // this.myviewer = new marmoset.WebViewer('100%', height, 'https://culturecloud.oss-cn-hangzhou.aliyuncs.com/ed018b5fa984403ab0651655d2c781bd.mview');
            this.myviewer = new marmoset.WebViewer('100%', height, this.url);
            let myDivOrSomething = this.$refs.threeBox;
            myDivOrSomething.appendChild(this.myviewer.domRoot);
            this.myviewer.loadScene();
            this.myviewer.onLoad = () => {
                /* do something fun here */
                this.isLoading = false;
            };
        } else {
            if (this.type == 2) {
                let num = _height - 600;
                // this.myviewer = new marmoset.WebViewer('100%', num, '/static/js/918_big.mview');
                this.myviewer = new marmoset.WebViewer('100%', num, this.url);
                let myDivOrSomething = this.$refs.threeBox;
                myDivOrSomething.appendChild(this.myviewer.domRoot);
                this.myviewer.loadScene();
                this.myviewer.onLoad = () => {
                    /* do something fun here */
                    this.isLoading = false
                };
            } else if (this.type == 3) {

            } else {
                this.myviewwer = marmoset.embed(this.url, {
                    width: 20,
                    height: 20,
                    autoStart: true,
                    fullFrame: true,
                    pagePreset: false
                });

            }

        }

    },
    destroyed() {
        if (this.type) {
            let myDivOrSomething = this.$refs.threeBox;
            if (this.myviewer && this.myviewer.sceneURL && myDivOrSomething) {
                myDivOrSomething.removeChild(this.myviewer.domRoot);
                this.myviewer.unload()
            }
            this.myviewer.unload()
            this.myviewer = null;
        } else {
            document.body.removeChild(this.myviewer.domRoot)
        }

    },
    methods: {
        addLink() {
            this.$router.push({
                name: "cultureGatherIndex"
            })
        }
    }
}
</script>

<style lang="scss" scoped>
* {
    padding: 0;
    margin: 0;
    outline: none;
    border: none;
}

img {
    object-fit: cover;
    pointer-events: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
}

@mixin flex($center, $content) {
    display: flex;
    justify-content: $content;
    align-items: $center;
}

body {
    background: #000;

}

.banner-box {
    width: 100%;
    position: relative;
    background-size: cover;
    padding: 0;
    background: #000;

    &.cont-info {
        .lable {
            width: auto;
            height: 96px;
            position: absolute;
            right: 40px;
            bottom: 319px;
            z-index: 5;
        }

        .info-body {
            padding-top: 165px;
            width: 100%;
            position: absolute;
            left: 0;
            bottom: 0px;
            z-index: 1;

            &.isBackground {
                background: url(../../assets/images/tiangong/zhantai.png) no-repeat center top;
                background-size: 100%;
            }

            .info-box {
                width: 100%;
                @include flex(flex-end, center);
                padding: 50px 44px 40px;
                box-sizing: border-box;

                .info-left {
                    flex: 2;
                    @include flex(flex-start, flex-start);
                    flex-direction: column;

                    .text {
                        font-size: 29px;
                        font-family: Source Han Serif CN;
                        color: #ffffff;
                    }

                    h3 {
                        margin-top: 10px;
                        font-size: 42px;
                        font-family: Source Han Serif CN;
                        color: #ffffff;
                    }

                    .type {
                        margin-top: 40px;
                        font-size: 27px;
                        font-family: Source Han Serif CN;
                        color: #ffffff;
                    }
                }

                .info-right {
                    flex: 1;
                    @include flex(flex-end, flex-start);
                    flex-direction: column;

                    .company {
                        font-size: 29px;
                        font-family: Source Han Serif CN;
                        font-weight: bold;
                        color: #ffffff;
                    }

                    .icon-close {
                        margin-top: 10px;
                        font-size: 32px;
                        color: #ffffff;
                    }

                    .issue {
                        margin-top: 10px;
                        font-size: 29px;
                        font-family: Source Han Serif CN;
                        font-weight: bold;
                        color: #ffffff;
                    }

                    .limited {
                        margin-top: 15px;
                        padding-top: 12px;
                        border-top: 2px solid #fff;
                        font-size: 29px;
                        font-family: Source Han Serif CN;
                        font-weight: 500;
                        color: #ffffff;
                        @include flex(flex-start, center);

                        i {
                            font-style: normal;
                            color: #e1bf81;
                            font-size: 33px;
                            font-weight: bold;
                            margin: 0 8px;
                        }
                    }
                }
            }
        }
    }

    &.order-info {
        height: 100vh;
        background: url(https://culturecloud.oss-accelerate.aliyuncs.com/sh/202291616/orderbackbg.png) no-repeat left bottom;
        background-size: 100%;
    }

    .head-box {
        width: 100%;
        @include flex(center, center);
        flex-direction: column;
        padding: 40px 87px 0;
        box-sizing: border-box;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 12;

        .img1 {
            width: 85%;
            height: auto;
        }

        .icon-ARROW-left-copy {
            position: absolute;
            left: 30px;
            top: 60px;
            font-size: 60px;
            color: #fff;
        }
    }

    .conten-box {
        width: 100%;
        position: relative;

        // .banner-background-box {
        //     position           : absolute;
        //     left               : 0;
        //     top                : 0;
        //     // background-color: rgb(50,50,50);
        //     background         : url('../../../public/static/js/tietu.png') no-repeat center center;
        //     // background-size: cover;
        //     opacity            : 1;
        //     z-index            : 1;
        //     width              : 100%;
        //     height             : 100%;
        //     filter             : blur(20px);

        //     .loading-common {
        //         position : absolute;
        //         left     : 50%;
        //         top      : 50%;
        //         transform: translate(-50%);
        //         width    : 80px;
        //         height   : 80px;
        //         z-index  : 3;
        //     }

        //     &.loading-box {
        //         opacity  : 1;
        //         z-index  : 1;
        //         animation: identifier 1s linear both;

        //         @keyframes identifier {
        //             from {
        //                 opacity: 1;
        //                 z-index: 1;
        //             }

        //             to {
        //                 opacity: 1;
        //                 z-index: -1;
        //             }
        //         }
        //     }
        // }

        .three-box {
            position: relative;
            z-index: 0;

            .loading-common {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%);
                width: 100px;
                height: 100px;
                z-index: 3;
            }

            #marmosetUI {
                position: relative;

                div {
                    &:nth-last-of-type(3) {
                        display: none;
                    }

                    &:last-of-type {
                        div {
                            display: none;
                        }
                    }
                }

                text {
                    display: none;
                }
            }
        }
    }

    .lable {
        width: auto;
        height: 96px;
        position: absolute;
        right: 40px;
        bottom: -130px;
        z-index: 1;
        bottom: calc(-100vh + 400px);
    }

    .info-body {
        width: 100%;
        background-size: cover;
        position: absolute;
        left: 0;
        bottom: calc(-100vh + 100px);
        z-index: 11;

        .info-box {
            width: 100%;
            @include flex(center, center);
            padding: 0px 44px 70px;
            box-sizing: border-box;

            .info-left {
                @include flex(center, flex-start);
                flex-direction: column;

                .text {
                    font-size: 29px;
                    font-family: Source Han Serif CN;
                    color: #ffffff;
                }

                h3 {
                    margin-top: 10px;
                    font-size: 42px;
                    font-family: Source Han Serif CN;
                    color: #ffffff;
                }

                .type {
                    margin-top: 24px;
                    font-size: 27px;
                    font-family: Source Han Serif CN;
                    color: #ffffff;
                }
            }
        }
    }

    .mycollection-detail-banner {
        width: 100%;
        height: auto;
        position: relative;

        .head-box {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 10;
            padding: 40px 20px;
            box-sizing: border-box;

            i {
                font-size: 56px;
                color: #fff;
            }
        }

        .three-box {
            position: relative;
            height: calc(100vh - 600px);
            background-color: #000;

            #marmosetUI {
                position: relative;

                div {
                    &:nth-last-of-type(3) {
                        display: none;
                    }

                    &:last-of-type {
                        div {
                            display: none;
                        }
                    }
                }

                text {
                    display: none;
                }
            }
        }

        .loading-common {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%);
            width: 100px;
            height: 100px;
        }

        .img2 {
            position: absolute;
            right: 30px;
            bottom: 38px;
        }

        .info-body {
            width: 100%;
            position: absolute;
            left: 0;
            bottom: 0px;
            z-index: 1;
            height: 300px;

            &.isBackground {
                display: flex;
                align-items: flex-end;
                justify-content: center;
                box-sizing: border-box;
                padding-bottom: 40px;
                // background: url(../../assets/images/tiangong/zhantaismall.png) no-repeat center top;
                // background-size: 100%;

                .icon-fangda {
                    font-size: 48px;
                    color: #fff;
                }
            }
        }
    }
}

.footer-box {
    width: 100%;
    position: fixed;
    left: 0;
    bottom: -1px;
    background-color: black;
    height: 188px;
    padding: 24px 46px 2px 40px;
    box-sizing: border-box;
    @include flex(flex-start, center);
    z-index: 999;

    .tilp-box {
        @include flex(center, center);
        position: absolute;
        left: 0;
        bottom: 218px;
        width: 100%;
        animation: slide_up 2s ease-in-out infinite;

        i {
            font-size: 36px;
            color: rgba($color: #fff, $alpha: 0.5);
        }
    }

    @keyframes slide_up {

        0%,
        30% {
            opacity: 0;
            -webkit-transform: translate3d(0, 10px, 0);
        }

        60% {
            opacity: 1;
            -webkit-transform: translateZ(0);
        }

        to {
            opacity: 0;
            -webkit-transform: translate3d(0, -5px, 0);
        }
    }

    .button-left {
        flex: 1;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;

        p {
            font-size: 28px;
            font-family: SourceHanSerifCN-Medium, SourceHanSerifCN;
            font-weight: 500;
            color: #e1bf81;
            line-height: 40px;
            padding-top: 24px;
            position: absolute;
            padding-left: 40px;
            box-sizing: border-box;
            left: 0;
            bottom: -100%;
            opacity: 0;
            @include flex(center, flex-start);
            transition: bottom 0.5s linear, opacity 0.5s linear;

            span {
                font-size: 48px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: bold;
                color: #ffffff;
                margin: 0 6px;
            }

            &.price {
                font-size: 28px;
                // padding-right : 117px;
                width: 50%;
                box-sizing: border-box;
                height: 100%;
                color: #e1bf81;
                flex-direction: column;
                align-items: flex-start;

                a {
                    text-decoration: none;
                    display: inline-block;
                    color: #e1bf81;
                    padding-top: 8px;

                    .lab {
                        font-style: normal;
                        font-weight: bold;
                        font-size: 40px;
                        color: #fff;
                        padding-top: 14px;
                    }

                    span {
                        font-size: 72px;
                        margin: 0;

                        &.small {
                            font-size: 40px;
                        }
                    }

                    .big {
                        font-style: normal;
                        font-weight: bold;
                        font-size: 30px;
                        color: #fff;
                        margin: 0 8px;
                    }

                    &:first-of-type {
                        padding-top: 20px;
                    }
                }
            }
        }
    }

    .button-right {
        flex: 1;
        @include flex(center, flex-start);
        flex-direction: column;
        position: absolute;
        right: 25%;
        top: 0;
        height: 100%;
        box-sizing: border-box;
        padding-top: 24px;
        color: #27dd81;

        &.availableCount {
            padding-top: 0;
            justify-content: center;

            button {
                position: relative;

                &::after {
                    content: '';
                    display: block;
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba($color: #000, $alpha: 0.5);
                }
            }
        }

        button {
            width: 366px;
            height: 88px;
            background: url(../../assets/images/tiangong/ys_btn.png) no-repeat;

            span {
                font-size: 36px;
                font-weight: bold;
                color: #27dd81;
                background: linear-gradient(137deg, #f3dfb9 0%, #ffc275 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                letter-spacing: 4px;
            }
        }

        p {
            margin-top: 8px;
            font-size: 24px;
            font-family: SourceHanSerifCN-Medium, SourceHanSerifCN;
            color: #ffffff;
            @include flex(center, center);
            opacity: 1;

            span {
                font-size: 32px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: bold;
                color: #ff8628;
            }
        }
    }
}
</style>
