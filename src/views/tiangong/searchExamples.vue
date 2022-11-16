<template>
<div class="searchExamples-content">
    <h3 class="searchExamples-title-tt">
        <i class="iconfont icon-ARROW-left-copy" @click="goHome"></i>
        选择转赠对象
    </h3>
    <div class="searchExamples-search-tt">
        <input @blur="addblur" @keyup.13="addInfoByMobile" @enter="addInfoByMobile" type="search" v-model.number="value" maxlength="11" placeholder="输入对方手机号">
        <i @click="addInfoByMobile">搜索</i>
    </div>
    <div class="searchExamples-body-tt" v-if="recordList.length">
        <p class="Examples-name-tt">请选择转赠对象</p>
        <ul class="Examples-list">
            <li v-for="(res,e) in recordList" :key="e" @click="addCheckNum(e,res)">
                <img :src="res.userHeadImgUrl || userPic" alt="">
                <p>
                    <span>{{sub(res.userMobileNo,3,4,4)}}</span>
                    <span>{{sub(res.userNickName,0,1)}}</span>
                    <i :class="['iconfont select-icon',{'icon-duigou':res.bool}]"></i>

                </p>
            </li>
        </ul>
        <div :class="['Examples-btn',{'active':isActive}]" @click="addNextStep">
            <button>下一步</button>
        </div>
    </div>
    <Overlay :show="checkUserName">
        <div class="pubilic-content">
            <div class="colse-headerbtn" @click="checkUserName=false">
                 <i class="iconfont icon-close"></i>
            </div>
            <div class="head-box">
                <h3>设置昵称</h3>
            </div>
            <div class="cont-box">
                <p>您还未设置昵称，请先设置，让您的朋友能快速查到您。</p>
                <input v-model="user.userName" type="text" @blur="addblur" placeholder="请输入昵称" />
            </div>
            <div class="foot-box">
                <button class="canle" @click="checkUserName=false">取消</button>
                <button @click="submit">保存</button>
            </div>
        </div>
    </Overlay>
    <pubilcPopBox :canleBackType="canleBackType" :titlename="titlename" :isIcon="isIcon" :canleTit="canleTit" :comipteTit="comipteTit" :iscanle="iscanle" @addcanle="addcanle" :content="errContent" :ispopshow="ispopshow" @callback="callback" :iscallback="iscallback">
    </pubilcPopBox>
</div>
</template>

<script>
import pubilcPopBox from '@/components/culture-gather/public-pop-box';
import userPic from '../../assets/images/culture-gather/user-pic.png'
import {
    queryUserInfoByMobile,
    withAllSecurity,
} from '@/assets/api/gateway';
import {
    editTerminalUser,
} from '@/assets/api/index';
import encrypt from '@/utils/encrypt.js';
import {
    Overlay,
    Toast
} from 'vant';
import 'vant/es/toast/style';
export default {
    name: 'searchExamples',
    components: {
        pubilcPopBox,
        Overlay
    },
    data() {
        return {
            value: '',
            ispopshow: false,
            errContent: '搜索不到您要转赠的对象，请重新输入手机号再次搜索，或者分享邀请注册页面，让您的朋友注册并实名平台账号，再进行转赠！',
            iscanle: true,
            isIcon: false,
            canleTit: '返回',
            comipteTit: '邀请好友注册',
            titlename: '暂无搜索结果',
            iscallback: () => {},
            url: '天工严选数字藏品平台，有趣好玩，活动多多，精品多多，值得关注！赶快注册：',
            user: {},
            canleBackType: 1,
            checkUserName: false,
            recordList: [],
            isActive: false,
            userPic,
            spuId: this.$route.query.spuId || ''
        }
    },
    created() {
        this.getUserInfo();
    },
    methods: {
        sub(str, startLength, endLength, num) {
             return encrypt.subText(str, startLength, endLength, num);
        },
        addNextStep() {
            if (this.isActive) {
                this.$router.push({
                    name: 'confirmExamples',
                    query: {
                        nftUserId: this.isActive,
                        spuId: this.spuId
                    }
                })
            } else {
                return Toast({
                    message: '请选择要转赠的用户',
                    icon: 'fail'
                });
            }

        },
        addCheckNum(val, ele) {
            this.isActive = false;
            this.recordList = this.recordList.map((ele, i) => {
                ele.bool = false;
                if (i == val) {
                    this.isActive = ele.userId;
                    ele.bool = true;
                }
                return ele;
            })
        },
        submit() {
            if (this.user.userName == '') {
                return Toast({
                    message: '请输入昵称',
                    icon: 'fail'
                });
            }
            let obj = {
                userName: this.user.userName,
                userSex: this.user.userSex,
                userEmail: this.user.userEmail,
                userHeadImgUrl: this.user.userHeadImgUrl,
                shopPath: this.$route.params.shopPath,
            }
            editTerminalUser(obj).then(res => {
                if (res.status != 200) {
                    return Toast({
                        message: res.errMsg,
                        icon: 'fail'
                    });
                }
                Toast({
                    message: '保存成功',
                    icon: 'passed'
                });
                return this.checkUserName = false
            })
        },
        // 获取实名认证详情
        getUserInfo() {
            let token = window.localStorage.getItem("jwtToken") || '';
            let obj = {
                shopPath: this.$route.params.shopPath,
                token: encrypt.Encrypt(JSON.stringify({
                    token,
                    timeStamp: Date.parse(new Date())
                }))
            };
            withAllSecurity(obj).then(res => {
                if (res.status != 200) {
                    return
                }
                let body = encrypt.decodeAesString(res.data || {});
                this.user = (body || {});
                // userType 实名认证 1未提交,2通过,3未审核,4审核不通过    通过和审核中不能修改信息
            });
        },
        addInfoByMobile() { //根据手机号查询用户
            if (this.value == '') {
                return Toast({
                    message: '请填写手机号码!',
                    icon: 'fail'
                });
            }
            if (!(/^1[3456789]\d{9}$/.test(this.value))) {
                return Toast({
                    message: '手机号码有误，请重填',
                    icon: 'fail'
                });
            }
            let query = {
                userMobileNo: this.value,
                shopPath: this.$route.params.shopPath,
            }
            queryUserInfoByMobile(query).then(res => {
                if (res.status != 200) {
                    if (res.status == 301 || res.status == 302 || res.status == 303 || res.status == 304) {
                        Toast({
                            message: res.data,
                            icon: 'fail'
                        });
                    } else if (res.status == 305) {
                        this.ispopshow = true;
                        this.iscallback = () => {
                            this.onCopy();
                        }
                    }
                    return

                }
                let data = res.data || [];
                this.recordList = data.map(ele => {
                    ele.bool = false;
                    return ele;
                });

            })
        },
        onCopy() {
            let tel = this.sub(this.user.userMobileNo, 3, 4, 4);
             let userNickName = this.sub(this.user.userNickName,0,2);
            let localUrl = `${window.location.protocol}//${this.$config.baseShopPath}/${this.$route.params.shopPath}/tiangong/login?name=cultureUserCenter&userName=${encodeURIComponent(userNickName)}&inviteId=${this.user.userId}&tel=${encodeURIComponent(tel)}`;
            let url = this.url + localUrl;
            let input = document.createElement('input')
            input.id = 'copy-input'
            input.readOnly = 'readOnly' // 防止ios聚焦触发键盘事件
            input.style.position = 'absolute'
            input.style.left = '-2000px'
            input.style.zIndex = '-2000'
            document.body.appendChild(input)
            input.value = url;
            // ios必须先选中文字且不支持 input.select();
            this.selectText(input, 0, url.length)
            if (document.execCommand('copy')) {
                document.execCommand('copy');
                window.scroll(0, 0)
                Toast({
                    message: '复制成功',
                    icon: 'passed'
                });
            } else {
                Toast({
                    message: '复制失败！',
                    icon: 'fail'
                });
            }
            input.blur();
            return window.location.href = 'weixin://';
        },
        // 选择文本。createTextRange(setSelectionRange)是input方法
        selectText(textbox, startIndex, stopIndex) {
            if (textbox.createTextRange) {
                // ie
                const range = textbox.createTextRange()
                range.collapse(true)
                range.moveStart('character', startIndex) // 起始光标
                range.moveEnd('character', stopIndex - startIndex) // 结束光标
                range.select() // 不兼容苹果
            } else {
                // firefox/chrome
                textbox.setSelectionRange(startIndex, stopIndex)
                textbox.focus()
            }
        },
        addcanle(el) {
            this.ispopshow = el;
        },
        callback(el) {
            if (el) {
                this.iscallback();
            }
            this.ispopshow = false;
            this.iscallback = () => {};
        },
        addblur() {
            const u = navigator.userAgent
            const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isIOS) {
                this.blurAdjust()
            }
            // 解决苹果不回弹页面
        },
        blurAdjust(e) {
            setTimeout(() => {
                if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
                    return
                }
                let result = 'pc';
                if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
                    result = 'ios'
                } else if (/(Android)/i.test(navigator.userAgent)) { //判断Android
                    result = 'android'
                }
                if (result = 'ios') {
                    document.activeElement.scrollIntoViewIfNeeded(true);
                }
            }, 100)
        },
        goHome() {
            this.$router.go(-1)
        }
    },
}
</script>

<style lang="scss">
@import '../../styles/tiangong/commen.scss';
@import '../../styles/tiangong/searchExamples.scss';
</style>
