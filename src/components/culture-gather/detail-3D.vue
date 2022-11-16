<template>
<div class="banner-box cont-info">
    <div class="head-box">
        <i class="iconfont icon-ARROW-left-copy" @click="goHome"></i>
        <img :src="detailList.seriesImage" alt="" class="img1">
    </div>
    <div class="conten-box">
        <div class="three-box" ref="threeBox">
            <img v-show="isLoading" src="../../assets/images/culture-gather/load.gif" alt="" class="loading-common">
        </div>
        <img v-show="detailList.spuLevelImage" :src="detailList.spuLevelImage" alt="" class="lable">
    </div>
    <div :class="['info-body isBackground',{'isBackground':detailList.hasBase==1}]" :style="{paddingTop:isSmallTop?'90px':'165px'}">
        <div class="info-box" :style="{paddingTop:isSmallTop?'40px':'50px'}">
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
export default {
    name: 'detail3D',
    props: {
        detailList: {
            type: Object,
             default () {
                return {};
            }
        }
    },
    data() {
        return {
            isSmallTop: false,
            myviewer:null,
            isLoading: true,
        }
    },
    created() {
        let _height = document.documentElement.clientHeight || document.body.clientHeight;
        this.isSmallTop = _height && _height <= 1300;
        this.$nextTick(() => {
            if (this.myviewer && this.myviewer.sceneURL) {
                let myDivOrSomething = this.$refs.threeBox;
                myDivOrSomething.removeChild(this.myviewer.domRoot)
            }
            this.initMarMoset(this.detailList.spuModelUrl);
        })
    },
    destroyed() {
        let myDivOrSomething = this.$refs.threeBox;
        if (this.myviewer && this.myviewer.sceneURL && myDivOrSomething) {
            myDivOrSomething.removeChild(this.myviewer.domRoot);
            this.myviewer.unload()
        }
        this.myviewer.unload()
        this.myviewer = null;
    },
    methods: {
        initMarMoset(url = "") {
            let _height = document.documentElement.clientHeight || document.body.clientHeight;
            let num = _height - 170;
            this.myviewer = new marmoset.WebViewer('100%', num, url);
            let myDivOrSomething = this.$refs.threeBox;
            myDivOrSomething.appendChild(this.myviewer.domRoot);
            this.myviewer.loadScene();
            this.myviewer.onLoad = (val) => {
                console.log(val, 'load')
                /* do something fun here */
                this.isLoading = false
            };
            console.log(this.myviewer, 'this.myviewer', marmoset);
        },
        goHome() {
            this.$router.push({
                name: 'cultureGatherIndex'
            })
        },
    }
}
</script>
