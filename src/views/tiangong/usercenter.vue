<template>
<div class="culture-usercenter-box">
    <div class="pop-box"></div>
    <div class="usercenter-header">
        <i class="usercenter-header-setup iconfont icon-shezhi" @click="goLink(1)"></i>
        <span class="usercenter-header-edit">
            <i class=" iconfont icon-edit" @click="goLink(2)"></i>
            <i :class="['iconfont icon-31xiaoxi',{'active':true}]" @click="goLink(9)"></i>
        </span>

    </div>
    <!-- 用户信息 -->
    <div class="usercenter-userinfo">
        <div class="userinfo-avatar-round">
            <Upload ref="upload" :multiple="false" :simultaneous-uploads="1" v-model="file" @files-added="addedHandler" @file-error="errHandler" @file-submitted="fileSubmitted">
            </Upload>
        </div>
        <div class="userinfo-name">{{user.userName?user.userName:sub(user.userMobileNo,3,4,4)}}</div>
        <div class="userinfo-mycollection-number" v-if="mycollectionNum"> <i class="iconfont icon-geshu user-mycollectio"></i>
            数字藏品： <i class="userinfo-mycollection-amount">{{mycollectionNum}}</i>
        </div>
        <div class="userinfo-address">
            区块链地址
            <span v-if="user.userType == 2" :class="['userinfoPass',{'noPass':user.userType==2}]" @click="showPopup(false,false)"><i v-if="user.userType==2" class="iconfont icon-duigouxuanzhong"></i>{{user.userType | userTypeFilter}}</span>
            <span class="userinfo-realname" @click="goLink(3)" v-else>未认证<i class="iconfont iconarrow_right userinfo-realname-iconarrow_right"></i>
            </span>
        </div>
        <div class="userinfo-priority" v-if="buyCount" @click="getJoinUser">
            <h3>优先购</h3><span>您有 {{buyCount}} 次优先购权益</span><img src="../../assets/images/tiangong/yxbtn.png" alt="">
        </div>
    </div>
    <!-- 交易信息 -->
    <div class="usercenter-menu">
        <div class="usercenter-menu-item" @click="goLink(4)">
            <i class="iconfont icon-jilu"></i>
            <div class="usercenter-menu-item-name">订单</div>
        </div>
        <div class="usercenter-menu-item" @click="goLink(5)">
            <i class="iconfont icon-dingdan"></i>
            <div class="usercenter-menu-item-name">记录</div>
        </div>
        <div class="usercenter-menu-item" @click="goLink(8)">
            <i class="iconfont icon-fenxiangxiao"></i>
            <div class="usercenter-menu-item-name">邀请好友</div>
        </div>
    </div>
    <!-- 我的藏品 -->
    <div class="usercenter-mycollection">
        <Tabs v-model="activeTitle" sticky animated swipeable :line-width="0" @change="onClickTab">
            <Tab v-for="(nav,n) in navList" :key="n" :title="nav.title">
                <template>
                    <List v-model="isLoading" :finished="finished" @load="getMycollectionList">
                        <div class="mycollection-menu-list" v-if="isListBool==1">
                            <div class="mycollection-list" v-for="(item,index) in mycollectionList" :key="index" @click="addDetail(item)">
                                <div class="mycollection-list-img">
                                    <img :src="item.spuImages" alt="" class="img1">
                                    <span class="img2">x{{item.buyCount || 1}}</span>
                                    <div class="mask-box" v-show="navIdx==1 && item.transferStatus==1">
                                        <i class="iconfont icon-liwuhuodong"></i>
                                        <p>待接收</p>
                                    </div>
                                </div>
                                <div class="mycollection-list-info">
                                    <div class="mycollection-list-title">{{item.spuSubtitle}}{{item.spuName}}</div>
                                    <div class="info-label">
                                        <div class="info-label-left">
                                            <span class="info-label-left-icon">
                                                <img src="../../assets/images/culture-gather/limit2.png" alt="" class="info-label-left-img">
                                            </span>
                                            <span>{{item.seriesNo?item.seriesNo:item.buyCount==1?'上链中...':'上链中'}}{{item.buyCount==1?'':'...'}}</span>
                                        </div>
                                    </div>
                                    <div class="mycollection-list-subtitle">{{item.spuProduce}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="mycollection-noList" v-else-if="isListBool==2"><i class="iconfont icon-queshengye-cangpin"></i>
                            <p v-show="navIdx">暂无转赠藏品<br /></p>
                            <p class="align-box" v-show="navIdx">注：藏品接收并成功上链后<br />受赠的藏品会转移至我的藏品。</p>
                            <p v-show="!navIdx">您目前暂无数字收藏</p>
                        </div>
                    </List>
                </template>
            </Tab>
        </Tabs>
        <div class="mycollection-noList-text" v-if="mycollectionList.length"> — 没有更多藏品了 — </div>
    </div>
    <publicFooter :active="'usercenter'"></publicFooter>
    <pubilcPopBox :iscallback="iscallback" :iscanle="iscanle" :content="errContent" :ispopshow="ispopshow" @callback="callback">
    </pubilcPopBox>
    <div :class="['brand-desc',{'close-brand-desc':!blockLink && ispopBoxLink,'animation-desc':blockLink}]">
        <div class="brand-desc-header">
            <div class="brand-desc-title">区块链地址</div>
            <div class="brand-desc-headerbtn" @click="showPopup(false,true)">
                <i class="iconfont icon-close"></i>
            </div>
        </div>
        <p class="info-text">区块链上持有藏品的唯一地址</p>
        <div class="brand-desc-content brand-desc-link">
            <p @click="onCopy(nftData.address)" class="code">{{nftData.address || '上链中...'}}</p>
        </div>
    </div>
</div>
</template>

<script>
import {
    editTerminalUser,
} from '@/assets/api/index';
import {
    withAllSecurity,
    myGoodsNum,
    myGoodsList,
    nftUser,
    getuserPurchase,
    joinUserPurchase,
    receiverSpuList
} from '@/assets/api/gateway';
import encrypt from '@/utils/encrypt.js';
import {
    List,
    Tabs,
    Tab,
    Toast
} from 'vant';
import 'vant/es/toast/style';
import Upload from 'cube-ui/src/components/upload/upload.vue'
import pubilcPopBox from '@/components/culture-gather/public-pop-box';
import publicFooter from '@/components/culture-gather/footer-common';
import userPic from '../../assets/images/culture-gather/user-pic.png'
export default {
    name: 'cultureUserCenter',
    components: {
        pubilcPopBox,
        publicFooter,
        List,
        Upload,
        Tabs,
        Tab
    },
    data() {
        return {
            ispopBoxLink: false,
            blockLink: false,
            mycollectionList: [],
            user: {
                userId: '',
                userHeadImgUrl: ''
            },
            userType: '',
            filterParams: {
                page: 1,
                rows: 10,
                end: false, //页面最底
            },
            mycollectionNum: '',
            ispopshow: false,
            errContent: '',
            iscanle: false,
            iscallback: () => {},
            isLoading: false,
            finished: false,
            isListBool: false,
            userPic,
            file: [{
                name: "",
                size: "",
                url: '',
                status: 'ready'
            }],
            nftData: {},
            buyCount: 0,
            navList: [{
                title: '我的藏品'
            }, {
                title: '受赠藏品'
            }],
            navIdx: 0,
            activeTitle: '我的藏品',
            invitationUrl: '',
            url: '天工严选数字藏品平台，有趣好玩，活动多多，精品多多，值得关注！赶快注册：',
        }
    },
    beforeRouteEnter(to, form, next) {
        return next(vm => {
            vm.getUser()
        })
    },
    created() {
        this.getPurchase();
    },
    methods: {
        selectText(textbox, startIndex, stopIndex) {
            if (textbox.createTextRange) { //ie
                const range = textbox.createTextRange();
                range.collapse(true);
                range.moveStart('character', startIndex); //起始光标
                range.moveEnd('character', stopIndex - startIndex); //结束光标
                range.select(); //不兼容苹果
            } else { //firefox/chrome
                textbox.setSelectionRange(startIndex, stopIndex);
                textbox.focus();
            }
        },
        addDetail(item) {
            if (this.navIdx) {
                let name = ""
                if (item.transferStatus == 1) {
                    name = "receiveExamples"
                } else {
                    name = "cultureMycollectionDetail"
                }
                this.$router.push({
                    name,
                    query: {
                        id: item.transferId,
                        type: 1
                    }
                })
            } else {
                this.goLink(6, item.orderId, item.spuId)
            }

        },
        onClickTab(val) {
            this.navIdx = val;
            this.filterParams.page = 1;
            this.isListBool = false;
            this.mycollectionList = [];
            this.getMycollectionList();
        },
        getJoinUser() {
            let obj = {
                shopPath: this.$route.params.shopPath,
            }
            joinUserPurchase(obj).then(res => {

                if (res.status != 200) {
                    this.ispopshow = true;
                    return this.errContent = res.errMsg;
                }
                this.$router.push({
                    name: 'cultureGatherIndex'
                })
            });
        },
        getPurchase() {
            let obj = {
                shopPath: this.$route.params.shopPath,
            }
            getuserPurchase(obj).then(res => {

                if (res.status != 200) {
                    return
                }
                let data = res.data || {};
                this.buyCount = data.buyCount || 0;
            });
        },
        getNftUrl() {
            let obj = {
                shopPath: this.$route.params.shopPath,
            }
            nftUser(obj).then(res => {

                if (res.status != 200) {
                    return
                }
                let data = res.data || {};
                this.nftData = data;
            });
        },
        onCopy(url, bool) {
            if (!url) return;
            let input = document.createElement('input')
            input.id = 'copy-input'
            input.readOnly = true; // 防止ios聚焦触发键盘事件
            // input.style.position = 'absolute'
            // input.style.left = '-2000px'
            // input.style.zIndex = '-2000'
            document.body.appendChild(input);
            input.value = url;
            // ios必须先选中文字且不支持 input.select();
            this.selectText(input, 0, url.length)

            if (document.execCommand('copy')) {
                document.execCommand('copy')
                window.scroll(0, 0)
                Toast({
                    message: '复制成功',
                    icon: 'passed'
                });
            } else {
                Toast({
                    message: '复制失败！',
                    icon: 'passed'
                });
            }
            input.blur();
            if (bool) {
                return window.location.href = 'weixin://';
            }
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
        showPopup(params, bool = false) {
            if (!params) {
                this.blockLink = !this.blockLink
                this.ispopBoxLink = bool;
            }
        },
        addedHandler() {
            var file = this.file[0];
            file && this.$refs.upload.removeFile(file);
        },
        errHandler(file) {
            this.ispopshow = true;
            return this.errContent = '上传失败';
        },
        fileSubmitted(file) {
            var that = this;
            file.base64Value = file.file.base64;
            this.CooOss(file.file).then(function (res) {
                that.user.userHeadImgUrl = res.url + '?x-oss-process=image/resize,w_150,h_150';
                that.submit();
            });
        },
        submit() {
            if (this.user.userHeadImgUrl == '') return;
            let obj = {
                userId: this.user.userId,
                userName: this.user.userName,
                userSex: this.user.userSex,
                userEmail: this.user.userEmail,
                userHeadImgUrl: this.user.userHeadImgUrl,
                shopPath: this.$route.params.shopPath,
            }
            editTerminalUser(obj).then(res => {
                if (res.status != 200) {
                    this.ispopshow = true;
                    return this.errContent = res.errMsg;
                }
                this.ispopshow = true;
                this.errContent = '保存成功！';
                this.iscallback = () => {};
            })
        },
        sub(str, startLength, endLength, num) {
            return encrypt.subText(str, startLength, endLength, num)
        },
        getUser() {
            this.getNftUrl();
            this.getDetail();
            this.getMycollectionNum();
        },
        callback(el) {
            if (el) {
                this.iscallback();
            }
            this.ispopshow = false;
            this.iscallback = () => {};
        },
        // 获取实名认证详情
        getDetail() {
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
                this.user = body;
                let tel = this.sub(this.user.userMobileNo, 3, 4, 4);
                let userNickName = this.sub(this.user.userNickName, 0, 2);
                let localUrl = `${window.location.protocol}//${this.$config.baseShopPath}/${this.$route.params.shopPath}/tiangong/login?name=cultureUserCenter&userName=${encodeURIComponent(userNickName)}&inviteId=${this.user.userId}&tel=${encodeURIComponent(tel)}`;
                let url = this.url + localUrl;
                this.invitationUrl = url
                this.file[0].url = this.user.userHeadImgUrl || this.userPic;
                // userType 实名认证 1未提交,2通过,3未审核,4审核不通过    通过和审核中不能修改信息
            });
        },
        getMycollectionNum() {
            let obj = {
                shopPath: this.$route.params.shopPath,
            }
            myGoodsNum(obj).then(res => {

                if (res.status != 200) {
                    return
                }
                let data = res.data || 0;
                this.mycollectionNum = data;
            });
        },
        getMycollectionList() {
            let obj = {
                shopPath: this.$route.params.shopPath,
                page: this.filterParams.page,
                rows: this.filterParams.rows
            }
            let attr = this.navIdx ? receiverSpuList : myGoodsList;
            attr(obj).then(res => {

                if (res.status != 200) {
                    this.isListBool = 2;
                    return this.finished = true;
                }
                let data = res.data || [];
                if (!data.length && !this.mycollectionList.length) {
                    this.isListBool = 2;

                    this.isLoading = false;
                    this.finished = true;
                } else {
                    this.isListBool = 1;
                    this.push(data);
                    if (data.length == this.filterParams.rows) {
                        this.isLoading = true;
                        this.filterParams.page += 1
                        this.finished = false;
                        this.getMycollectionList();
                    } else {
                        this.finished = true;
                    }

                }
            });
        },
        push(arr) {
            this.mycollectionList.push.apply(this.mycollectionList, arr);
        },
        goLink(params, id, spuId) {
            const linkTypeObj = {
                1: 'cultureSetting',
                2: 'culturePersonalDetail',
                3: 'creatBlockChain',
                4: 'cultureOrder',
                5: 'cultureHistoryOrder',
                6: 'cultureMycollectionDetail',
                7: 'cultureGatherIndex',
                8: 'inviteFriends',
                9:'messageList',
            }
            let obj = {
                name: linkTypeObj[params],
                query: {}
            }
            if (linkTypeObj[params] == 'cultureMycollectionDetail') {
                obj.query.id = id;
                obj.query.spuId = spuId;
            }
            this.$router.push(obj);
        }
    },
    filters: {
        userTypeFilter(type) { // 1未提交,2通过,3未审核,4审核不通过
            const typeObj = {
                2: '已认证',
                3: '未认证',
                4: '未认证'
            }
            return typeObj[type]
        }
    }
}
</script>

<style lang="scss">
@import '../../styles/tiangong/commen.scss';
@import '../../styles/tiangong/usercenter.scss';
</style>
