<template>
<div class="culture-common-footer">
    <div class="footer-menu-item" @click="goLink(1)">
        <i :class="['iconfont footer-size-img icon-shouye1',{'menuItemActive':active=='home'}]"></i>
        <div :class="[active =='home'?'menuItemActive':'']">首页</div>
    </div>
    <!-- <div class="footer-menu-item" @click="goLink(3)">
        <i :class="['iconfont footer-size-img icon-chanpin1',{'menuItemActive':active=='bazaar'}]"></i>
        <div :class="[active == 'bazaar'?'menuItemActive':'']">集市</div>
    </div> -->
    <div class="footer-menu-item" @click="goLink(2)">
        <i :class="['iconfont footer-size-img icon-wode',{'menuItemActive':active=='usercenter'}]"></i>
        <div :class="[active == 'usercenter'?'menuItemActive':'']">我的</div>
    </div>
</div>
</template>

<script>
export default {
    name: 'footer-common',
    props: {
        active: {
            type: String,
            default: 'home'
        },
    },
    data() {
        return {
            user: {
                userId: ''
            },
        }
    },
    methods: {
        goLink(params) {
            let name = null;
            if (params == 1) {
                if (this.active =='home') {
                    return
                }
                name = `cultureGatherIndex`
            }else if (params == 2) {
                  if (this.active =='usercenter') {
                    return
                }
                name = `cultureUserCenter`
            }else if (params == 3) {
                  if (this.active =='bazaar') {
                    return
                }
                name = `bazaar`
            }
            this.$router.push({
                name
            });
        }
    },
}
</script>
