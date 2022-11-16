<template>
<div class="about-us-content">
    <img src="../../assets/images/tiangong/logo.png" alt="" class="logo">
    <p class="info-text">
        “天工严选数字藏品”依托文化云，汇集中国顶级文化艺术资源，聚合国内顶级美术馆，国家级非遗传承人，知名艺术家，知名收藏家的艺术作品、典藏文物，致力打造全球领先的数字藏品综合服务平台。充分运用3D建模、区块链等元宇宙相关技术对藏品进行数字化采集、创作、发行、交易。
    </p>
    <div class="cont-info">
        <h3>2022年6月</h3>
        <p class="info-text">
            创图科技和中国数字文化集团等数十家官方背景机构共建数字文化链，并与上海自贸文投旗下艺术浦东签署数字藏品首发协议。</p>
    </div>
    <div class="cont-info no-bottom-box">
        <h3>2022年8月</h3>
        <p class="info-text">8月18日中午12时，“天工严选”首发两款国家级非遗数字藏品——唐明敏的绒绣《浦东陆家嘴》、曹爱勤的江西景德镇瓷刻《富春山居图》，开售后仅2分钟，首期限量6000份的两款藏品便下单一“抢”而空。</p>
    </div>
</div>
</template>

<script>
export default {
    name: 'cultureAboutUs'
}
</script>

<style lang="scss" scoped>
.about-us-content {
    padding: 132px 74px 142px 58px;
    box-sizing: border-box;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(225deg, #121115 0%, #000000 100%);

    .logo {
        width: 372px;
        height: auto;
        margin-bottom: 76px;
    }

    .info-text {
        font-size: 30px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 48px;
        text-align: justify;
    }

    .cont-info {
        position: relative;
        width: 100%;
        margin-top: 40px;
        padding-left: 34px;
        box-sizing: border-box;

        &.no-bottom-box {
            margin-top: 0;
            padding-top: 40px;

            &::before {
                top: 60px;
            }

            &::after {
                height: calc(100% - 22px);
            }
        }

        h3 {
            font-size: 42px;
            font-weight: bold;
            color: #fff;
            line-height: 58px;
        }

        &::before {
            content: '';
            display: block;
            position: absolute;
            left: 0;
            top: 22px;
            width: 14px;
            height: 14px;
            background: #d8b77b;
            border: 2px solid #d8b77b;
            border-radius: 50%;
        }

        &::after {
            content: '';
            display: block;
            position: absolute;
            left: 8px;
            top: 22px;
            width: 2px;
            height: 100%;
            background-color: #d8b77b;
        }
    }
}
</style>
