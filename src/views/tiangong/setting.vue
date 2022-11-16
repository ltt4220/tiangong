<template>
<div class="setting-box culture-commen-background">
    <div class="list-menu">
        <div class="menu-item" @click="goLink(6)">
            <p>
                <i class="icon-useragree iconfont icon-mima"></i>
                <span class="menu-item-content">操作密码</span>
            </p>
            <span v-show="isPassword!=-1" :class="['setting-text',{'active':true}]">{{isPassword?'修改':'未设置'}}</span>
            <i class="iconfont icon-arrowRight"></i>
        </div>
        <div class="menu-item" @click="goLink(1)">
            <p>
                <i class="icon-useragree iconfont icon-yonghuxieyi"></i>
                <span class="menu-item-content">用户协议</span>
            </p>
            <i class="iconfont icon-arrowRight"></i>
        </div>
        <div class="menu-item" @click="goLink(5)">
            <p>
                <i class="icon-useragree iconfont icon-yinsi"></i>
                <span class="menu-item-content">隐私政策</span>
            </p>
            <i class="iconfont icon-arrowRight"></i>
        </div>
        <div class="menu-item" @click="goLink(2)">
            <p>
                <i class="icon-about iconfont icon-yijianfankui"></i>
                <span class="menu-item-content">意见反馈</span>
            </p>
            <i class="iconfont icon-arrowRight"></i>
        </div>
        <div class="menu-item" @click="goLink(3)">
            <p>
                <i class="icon-about iconfont icon-guanyuwomen"></i>
                <span class="menu-item-content">关于我们</span>
            </p>
            <i class="iconfont icon-arrowRight"></i>
        </div>
        <div class="menu-item" @click="subWechatKefuCallBack">
            <p>
                <i class="icon-about iconfont icon-kefu"></i>
                <span class="menu-item-content">我的客服</span>
            </p>
            <i class="iconfont icon-arrowRight"></i>
        </div>
        <div class="menu-item" @click="goLink(4)" v-if="isOutLogin">
            <p>
                <i class="icon-about iconfont icon-tuichudenglu"></i>
                <span class="menu-item-content">退出登录</span>
            </p>
            <i class="iconfont icon-arrowRight"></i>
        </div>
    </div>
    <div class="info-box">
        <p>如有任何疑问，请联系我们的客服</p>
        <p>
            <i class="iconfont icon-24gl-phoneLoudspeaker"></i>客服电话<a href="tel:02136696098-8125">02136696098-8125</a>
        </p>

    </div>
</div>
</template>

<script>
import {
    setTransferPwd,
} from '@/assets/api/gateway';
export default {
    name: 'cultureSetting',
    data() {
        return {
            userName: '',
            isDelete: false,
            user: {},
            workLink: 'https://work.weixin.qq.com/kfid/kfc7625783dcdee8167',
            isOutLogin: true,
            isPassword: -1,
        }
    },
    created() {
        // if (typeof window.whySDK == 'object') {
        //     this.isOutLogin = false
        // }
        this.addSetTransferPwd();
        window['ct_commonCallbackFromNative'] = (result, status) => {
            console.log(result, status, 'result, status')
            //result, status 参数对应的状态
            //"getUserInfo", "json" 用户数据
            //"wechatKefu", "json" 用户数据

        }
    },
    methods: {
        addSetTransferPwd() {
            let query = {
                shopPath: this.$route.params.shopPath,
            }
            setTransferPwd(query).then(res => {
                if (res.status != 200) return
                let data = res.data || {};
                if (data.pwdStatus == 'no') {
                    this.isPassword = false;
                } else {
                    this.isPassword = true;
                }
            })
        },
        subWechatKefuCallBack(data) {
            if (typeof window.whySDK == 'object' && typeof whySDK.wechatKefu == 'function') {
                var data = {
                    "corporateId": "ww2efa250da5dabd58",
                    "kfUrl": "https://work.weixin.qq.com/kfid/kfc7625783dcdee8167"
                };
                whySDK.wechatKefu(JSON.stringify(data));
            } else {
                window.location.href = this.workLink;
            }
        },
        goLink(params) {
            let obj = {
                1: 'userAgreement',
                2: 'cultureFeedback',
                3: 'cultureAboutUs',
                4: 'cultureGatherLogin',
                5: 'privacyAgreement',
                6: 'settingPass'
            }
            if (params == 4) {
                window.localStorage.removeItem('jwtToken');
                window.localStorage.removeItem('userType');
                return this.$router.push({
                    name: 'cultureGatherLogin',
                    query: {
                        name: 'cultureUserCenter',
                        ...(this.$route.query || {})
                    }
                });
            } else {
                if (params == 6 && this.isPassword) {
                    return this.$router.push({
                        name: 'checkWord'
                    });
                } else {
                    return this.$router.push({
                        name: obj[params]
                    });
                }

            }
        }
    },
}
</script>

<style lang="scss">
@import '../../styles/tiangong/commen.scss';
@import '../../styles/tiangong/setting.scss';
</style>
