<template>
<div class="cultureUnderstand-box">
    <img class="banner" :src="objImg.banner">
    <div class="cultureUnderstand-body">
        <div class="content-box">
            <p>“天工严选”数字藏品依托文化云，汇集中国顶级文化艺术资源，聚合国内顶级美术馆，国家级非遗传承人，知名艺术家，收藏家的艺术作品、典藏文物，致力打造全球领先的数字藏品综合服务平台。充分运用3D 建模、区块链等元宇宙相关技术对藏品进行数字化采集、创作、发行、交易。2022年7月文化云与上海自贸区文投旗下艺术浦东签署数字藏品首发协议，本次首发两款国家级非遗数字藏品。</p>
            <h3>一、《浦东陆家嘴》-唐明敏 绒绣</h3>
            <img class="img1" :src="objImg.product1">
            <p>本藏品为绒绣的传世之作。唐明敏的作品长期在人民大会堂作为国家文化代表作使用，收藏价值极高。数字藏品经唐明敏大师本人授权采集数据并发行，文化资源数据的确权路径清晰。授权总数量为1万件，首发仅3000件，非常值得藏家珍藏！</p>
            <h3>二、《富春山居图》-曹爱勤 瓷刻</h3>
            <img class="img1" :src="objImg.product2">
            <p>本藏品为国之重器。作者为中国雕刻艺术大师曹爱勤，该藏品获得2019年中国工艺美术博览会最高奖项"百鹤金鼎奖"。数字藏品经曹爱勤大师本人授权采集数据并发行，文化资源数据的确权路径清晰。授权总数量为1万件，首发仅3000件，极具珍藏价值！</p>
            <p class="text">文化云作为本次数字藏品发行方，是由中宣部、文化和旅游部、科技部重点支持，由上海创图网络科技股份有限公司建设运营的国家科技支撑项目。文化云汇聚公共数字文化服务、全民艺术普及、文化大数据、数字文化体验空间等线上线下服务模式，打造文化数字化业务生态，拥有多项发明专利技术和自主知识产权，2021年被中宣部、科技部等五部委评定为第四批国家文化和科技融合示范基地。</p>
            <p class="text">“天工严选”的首期发行主题为“活在当下的天工技艺”，其灵感来自于2021年6月举办的建党百年“百年百艺·薪火相传”中国非遗展。文化云作为线上展览的承办方，汇集整合了1500余件（套）国家级、省级非遗作品，共拍摄28000余张超高清照片，累计服务线上观众1467万人次，受到社会各界的广泛关注和普遍好评。为此，“天工严选”数藏将继续通过数字技术“活”化各类国家级非遗藏品，致力向广大用户普及非遗文化知识，为其发展增添新动力。</p>
        </div>
    </div>
</div>
</template>

<script>
import {
    WeChat
} from '@/plugins/mixin';
export default {
    name: 'cultureUnderstand',
    mixins: [WeChat],
    data() {
        return {
            objImg: {
                banner: 'http://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/sh/sh/virtualCommodity/20220814203740rYdD8A2ZptFRfIctkB0G_750_500.png',
                product1: 'http://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/sh/sh/H5/20220814202257liiax3ohBqjVAzG3CxUJ.png',
                product2: 'http://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/sh/sh/H5/20220814202407WEdHEycUkV39ifE7ncff.png'
            }
        }
    },
    created() {
        this.publicShare({
            shareTitle: '天工严选 致力数藏',
            shareImgUrl: 'https://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/sh/sh/H5/20220814214102aZDUfVhz0NQQ2dDfDDk9.png',
            shareDesc: '“天工严选”数字藏品依托文化云，汇集中国顶级文化艺术资源，聚合国内顶级美术馆、国家级非遗传承人，知名艺术家、收藏家的优秀藏品，典藏文物，致力于打造全球领先的数字藏品综合服务平台。'
        })
    },
    methods: {
        name() {

        }
    },
}
</script>

<style lang="scss" scoped>
* {
    padding: 0;
    margin: 0;
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

            p {
                font-size: 28px;
                line-height: 48px;
                color: #fff;
                text-align: justify;

                &.text {
                    margin-top: 56px;
                }
            }

            .img1 {
                width: 100%;
                height: auto;
                margin: 40px 0;
            }

            h3 {
                font-weight: normal;
                font-size: 30px;
                color: #fff;
                line-height: 48px;
                margin-top: 56px;
            }
        }
    }
}
</style>
