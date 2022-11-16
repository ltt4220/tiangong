<template>
<div>
    <div class="banner-box cont-info">
        <div class="head-box">
            <i @click="addLink" class="iconfont icon-ARROW-left-copy"></i>
            <img :src="detailList.seriesImage " alt="" class="img1">
        </div>
        <div class="conten-box">
            <div class="three-box" ref="threeBox"></div>
            <img v-show="detailList.spuLevelImage" :src="detailList.spuLevelImage" alt="" class="lable">
        </div>
        <div class="info-body">
            <div class="info-box">
                <div class="info-left">
                    <p class="text">{{detailList.spuSubtitle}}{{detailList.spuName}}</p>
                    <p class="type">{{detailList.spuProduce?detailList.spuProduce:''}}</p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
    getModuleFullScreen
} from '@/assets/api/gateway';
export default {
    name: 'cultureFullScreen',
    data() {
        return {
            isLoading: true,
            myviewer: null,
            id: this.$route.query.id || '',
            detailList: {},
            spuId: this.$route.query.spuId || '',
        }
    },
    destroyed() {
        document.body.removeChild(this.myviewer.domRoot)
        this.myviewer = null;
    },
    created() {
        this.getList();
    },
    methods: {
        initMarMoset(url = "") {
            this.myviewer = marmoset.embed(url, {
                width: 20,
                height: 20,
                autoStart: true,
                fullFrame: true,
                pagePreset: false
            });
        },
        addLink() {
            window.history.back();
        },
        getList() {
            const obj = {
                shopPath: this.$route.params.shopPath,
                spuId: this.spuId,
            }
            getModuleFullScreen(obj).then(res => {
                if (res.status != 200) {
                    return
                }
                let data = res.data || {};
                this.detailList = data;
                this.$nextTick(() => {
                    if (this.myviewer && this.myviewer.sceneURL) {
                        document.body.removeChild(this.myviewer.domRoot)
                    }
                    this.initMarMoset(this.detailList.spuSoldModelUrl);
                })
            });
        },
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

#marmosetUI {
    position: relative;

    div {
        &:nth-last-of-type(3) {
            display: none;
        }

        &:last-of-type {
            display: none;
        }
    }

    text {
        display: none;
    }
}

.banner-box {
    width: 100%;
    position: relative;
    background-size: cover;
    padding: 0;

    .head-box {
        width: 100%;
        @include flex(center, center);
        flex-direction: column;
        padding: 40px 87px 0;
        box-sizing: border-box;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;

        .img1 {
            width: 90%;
            height: auto;
        }

        .icon-ARROW-left-copy {
            position: absolute;
            left: 20px;
            top: 60px;
            font-size: 66px;
            color: #fff;
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
        ;
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
}
</style>
