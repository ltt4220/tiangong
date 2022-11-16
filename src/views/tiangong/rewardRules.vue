<template>
<div class="rewardRules-container-tt">
    <h3 class="rewardRules-title-tt">
        <i class="iconfont icon-ARROW-left-copy" @click="goHome"></i>
        <span>邀请好友奖励细则 </span>
    </h3>
    <ul>
        <li>奖励细则文案在这里显示。
            除非您已充分阅读、完全理解并接受本协议所有条款，否则您无权下载、安装或使用本平台和/或相关服务。您点击“同意”或您的下载、安装、使用、登录等行为或者您以其他任何明示或者默示方式表示接受本协议的，即视为您已阅读并同意本协议的约束。本协议即在您与创图科技之间产生法律效力，成为对双方均具有约束力的法律文件。
        </li>
        <li>任何未满18周岁的未成年人均不得注册帐号或使用本服务。上海创图网络科技股份有限公司将依赖您提供的个人信息判断用户是否为未成年人。此外，如果您不具有完全民事行为能力，请在法定监护人（以下简称“监护人”）的陪同下阅读和判断是否同意本协议。</li>
        <li>其他任何明示或者默示方式表示接受本协议的，即视为您已阅读并同意本协议的约束。本协议即在您与创图科技之间产生法律效力，成为对双方均具有约束力的法律文件。</li>
    </ul>
</div>
</template>

<script>
export default {
    name: 'rewardRules',
    data() {
        return {}
    },
    methods: {
        goHome() {
            this.$router.go(-1)
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../styles/tiangong/rewardRules.scss';
</style>
