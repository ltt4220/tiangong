<template>
<div class="bazaar-container">
    <div class="bazaar-content">
        <img src="https://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/202292416/bazaarPage.png" alt="">
        <p>寄售市场即将开放，敬请期待！</p>
    </div>
    <publicFooter :active="'bazaar'"></publicFooter>
</div>
</template>

<script>
import publicFooter from '@/components/culture-gather/footer-common';
export default {
    name: 'bazaar',
    components: {
        publicFooter
    },
}
</script>

<style lang="scss">
@import '../../styles/tiangong/commen.scss';

.bazaar-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding-bottom: 100px;
    box-sizing: border-box;

    .bazaar-content {
        width: 100%;
 display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
        img {
            width: 398px;
            height: 450px;
        }

        p {
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba($color: #fff, $alpha: 0.4);
            margin-top: 26px;
        }
    }
}
</style>
