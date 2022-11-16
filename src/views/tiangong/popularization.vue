<template>
<div class="cultureUnderstand-box">
    <img class="banner" :src="objImg.banner">
    <div class="cultureUnderstand-body">
        <div class="content-box">
            <h3>一、数字藏品是什么？</h3>
            <p>数字藏品是具有收藏价值的数字艺术品，也被称为NFT艺术品，属于有价值的文化资源数据。数字藏品需要经过版权所有者正式授权，并通过区块链技术完成数字确权后方可进行发售。每一件数字藏品都具备唯一的数字证书，藏品的流通过程可追溯且不可篡改。</p>
            <h3>二、数字藏品与元宇宙有什么关系？</h3>
            <p>如果说元宇宙是一个与现实世界平行的空间，那么数字藏品就是元宇宙世界中的艺术品。在元宇宙火爆全球的时代浪潮下，数字藏品作为元宇宙目前最重要的应用场景，受到了越来越多的年轻群体和收藏爱好者的青睐。</p>
            <h3>三、数字藏品有什么价值？</h3>
            <p class="text">1.&emsp;艺术欣赏价值。从目前情况看，大部分数字藏品都是制作精良的，包括造型、色彩、内容、故事性等都具有艺术品的特性，可以让人产生艺术欣赏的愉悦感。数字艺术品涵盖各大艺术门类，制作方式可以采用音像、影像、3D模型等。</p>
            <p class="text">2.&emsp;收藏价值。2022年5月，中央办公厅、国务院办公厅发布《关于推进实施国家文化数字化战略的意见》指出：“支持法人机构和公民个人在文化数据服务平台开设‘数据超市’，依法合规开展数据交易。文化产权交易机构要充分发挥市场、在线交易平台的优势，推动标识解析与区块链、大数据等技术融合创新，为文化资源数据和文化数字内容的确权、评估、匹配、交易、分发等提供专业服务。”因为数字藏品属于文化资源数据，限量发行且具有唯一性，所以具备较大的收藏价值，名家创作的艺术品收藏价值更高。数字藏品的制作方法既可以通过对线下实物艺术品进行数字化扫描复刻，也可以完全在数字空间进行创作。</p>
            <p class="text">3.&emsp;日常使用价值。人们在获得数字藏品后，可以转赠他人，满足社交需求，还可以通过发微信朋友圈进行展示，满足人们心理需求，这就是一种使用价值。比如在某个特定节日或某个朋友过生日，给对方送什么礼物呢？如果你送给朋友一个定制的、独特的、唯一性的数字艺术品或许是当下另一种时尚的选择。</p>
            <p class="text">4.&emsp;赋能实体价值。对于实物艺术品扫描复刻的数字藏品，通过数字藏品的推广和售卖，不仅可以提高实物艺术品本身的知名度，还可以提升其市场价值。我国作为艺术品资源极其丰富的文化大国，数字藏品产业化可作为推动国家文化数字化战略发展的催化剂，为弘扬优秀中华文化，树立文化自信，提升国家文化软实力增加新动能。</p>
            <h3>四、如何购买数字藏品？</h3>
            <p> 购买数字藏品需年满18周岁，需要通过实名认证。当前数字藏品领域鱼龙混杂，各种藏品及发行平台五花八门。消费者应谨慎挑选相对稳定及有官方背书的平台进行购买，同时防止个人信息泄露。</p>
            <div class="pic">
                <img :src="objImg.img" alt="">
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
    WeChat
} from '@/plugins/mixin';
export default {
    name: 'culturePopularization',
    mixins: [WeChat],
    data() {
        return {
            objImg: {
                banner: 'http://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/sh/sh/H5/202208161743390PkcTrv9qManK9QfqSOy_750_500.png',
                img: "http://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/sh/sh/H5/20220817102714PdvahWJRD7F3CwvXflSC_750_500.png"
            }
        }
    },
    created() {
        this.publicShare({
            shareTitle: '关于数字藏品的几个问题',
            shareImgUrl: 'https://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/sh/sh/H5/20220814214102aZDUfVhz0NQQ2dDfDDk9.png',
            shareDesc: '数字藏品是什么？数字藏品和元宇宙有什么关系？数字藏品有什么价值？如何购买数字藏品？'
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
            padding: 40px 30px;
            box-sizing: border-box;

            p {
                font-size: 28px;
                line-height: 48px;
                color: #fff;
                text-align: justify;
                text-indent: 2em;
                margin-bottom: 56px;

                &.text {
                    text-indent: 0;
                }
            }

            h3 {
                font-weight: normal;
                font-size: 36px;
                color: #00ffff;
                line-height: 48px;
                margin-bottom: 56px;
            }

            .pic {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;

                img {
                    width: 70%;
                    height: auto;
                }
            }
        }
    }
}
</style>
