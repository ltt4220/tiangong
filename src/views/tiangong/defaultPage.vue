<template>
<div class="defaultPage">
    <h3>{{errDateil.resultCode}}</h3>
    <p>{{errDateil.resultMesg}}</p>
    <p>请稍候重试！</p>
</div>
</template>

<script>
export default {
    name: 'defaultPage',
    data() {
        return {
            errDateil: {
                resultCode: this.$route.query.resultCode,
                resultMesg: this.$route.query.resultMesg
            },
        }
    },
}
</script>

<style lang="scss" scoped>
.defaultPage {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    h3 {
        font-size: 60px;
        margin-bottom: 70px;
    }

    p {
        text-align: center;
        line-height: 50px;
        font-size: 40px;
    }
}
</style>
