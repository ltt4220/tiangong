<template>
  <div class="invitedRecord-container-tt">
    <h3 class="invitedRecord-title-tt">
      <i class="iconfont icon-ARROW-left-copy" @click="goHome"></i>
      <span @click="addLink">奖励规则 </span>
    </h3>
    <div class="invitedRecord-head-tt">
        <h3><span>38</span>人</h3>
        <p>成功邀请好友人数</p>
    </div>
    <div class="invitedRecord-body-tt">
        <p class="invitedRecord-stats-tt"><span>被邀请人</span><span>状态</span></p>
        <ul>
            <li>
                <div class="left-box">
                    <img src="https://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/2022101910/2.jpg" alt="">
                    <div class="foot-box">
                        <h3>136****8960</h3>
                        <p>2022-10-20 18:09 注册</p>
                    </div>
               </div>
               <div :class="['right-box',{'active':true}]">
                    已注册
               </div>
            </li>
        </ul>
    </div>
  </div>
</template>

<script>
import encrypt from '@/utils/encrypt.js';
export default {
    name: 'invitedRecord',
    data() {
        return {
           
        }
    },
    methods: {
        sub(str, startLength, endLength, num) {
            return encrypt.subText(str, startLength, endLength, num)
        },
        addLink() {
            this.$router.push({name:'rewardRules'})
        },
        goHome(){
             this.$router.go(-1)
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../styles/tiangong/invitedRecord.scss';
</style>
