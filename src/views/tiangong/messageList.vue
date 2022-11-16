<template>
<div class="messageList-container-tt">
    <h3 class="messageList-title-tt">
        <span>
            <i class="iconfont icon-ARROW-left-copy" @click="goHome"></i>
            共<i>22</i>条未读消息
        </span>
        <i class="iconfont icon-shanchu-yichu-02"></i>
    </h3>
    <ul>
        <li>
            <p>系统消息<span>2022-09-16 11:48</span></p>
            <h3>收到异次元藏家赠送的数字藏品，快去查收吧！</h3>
            <p class="footer-text">查看详情<i class="iconfont icon-arrowRight"></i></p>
        </li>
    </ul>
</div>
</template>

<script>
export default {
    name: 'messageList',
    data() {
        return {

        }
    },
    methods: {
        goHome() {
            this.$router.go(-1)
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../styles/tiangong/messageList.scss';
</style>
