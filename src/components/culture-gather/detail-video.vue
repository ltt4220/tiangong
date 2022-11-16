<template>
<div class="cont-info banner-video-box">
    <Video-player ref="childvideo" :isPause="isPause" :options="videoOptions" class="banner"></Video-player>
    <div class="info-body">
        <div class="info-box">
            <div class="info-left">
                <p class="text">{{detailList.spuSubtitle}}</p>
                <h3>{{detailList.spuName}}</h3>
                <p class="type">{{detailList.classificationName}} · {{detailList.creatorName}}</p>
            </div>
            <div class="info-right">
                <span class="company">{{detailList.commodityIssuer}}</span>
                <i class="iconfont icon-close"></i>
                <span class="issue" v-show="detailList.unionPartner">{{detailList.unionPartner}}</span>
                <span class="limited">限量<i>{{detailList.spuStock}}</i>份</span>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
    qs
} from '@/utils/auth.js';
import VideoPlayer from "@/components/culture-gather/video-player.vue";
export default {
    name: "detailVideo",
    components: {
        VideoPlayer
    },
    props: {
        detailList: {
            type: Object,
            default () {
                return {
                    spuSubtitle: '这是测试3D',
                    spuName: '3D模型的demo',
                    classificationName: '测试',
                    creatorName: '创图',
                    commodityIssuer: '文化云',
                    unionPartner: '创图科技',
                    spuStock: '100'
                };
            }
        },
    },
    data() {
        return {
            isPause: false,
            videoOptions: {
                autoplay: 'muted', //muted视频静音
                controls: false,
                muted: true,
                height: 0,
                loop: true,
                poster: 'http://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/sh/sh/nftImage/202209011619049E7juz9PJxluFNKBSkfL_750_500.jpg',
                sources: [{
                    src: qs('url') || 'http://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/sh/sh/nftVideo/宝创街道视频-公益短篇-地球最后一滴水.mp4'
                }]
            },
        }
    },
    created() {
        let _width = document.documentElement.clientWidth || document.body.clientWidth;
        this.videoOptions.height = parseInt(_width * 1.7);
    },
    methods: {

    }
}
</script>

<style lang="scss">
@mixin flex($center, $content) {
    display: flex;
    justify-content: $content;
    align-items: $center;
}

.banner-video-box {
    width: 100%;
    padding: 0 !important;
    height: calc(100vh - 170px);

    .info-body {
        padding-top: 165px;
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0px;
        z-index: 1;

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
</style>
