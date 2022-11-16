<template>
<div class="personal-data-box culture-commen-background">
    <div class="usercenter-userinfo">
        <div class="userinfo-avatar-round">
            <Upload ref="upload" :multiple="false" :simultaneous-uploads="1" v-model="file" @files-added="addedHandler" @file-error="errHandler" @file-submitted="fileSubmitted">
            </Upload>
        </div>
    </div>
    <div class="personal-form">
        <div class="form-item">
            <input @blur="addblur" type="text" class="form-item-name" v-model="form.userName">
            <i class="iconfont icon-close" v-if="form.userName" @click="clear"></i>
        </div>
    </div>
    <div :class="['personal-submit',{'activeColor':form.userName}]" @click.prevent="submit"><span>保存资料</span></div>
    <div class="menu-item" @click="goLink(false,false)">
        <div class="left-box">
            <span class="menu-item-content">区块链地址</span>
        </div>
        <div class="right-box">
            <div class="text-info">
                <p class="address">{{user.userType==2?nftData.address:''}}</p>
            </div>
            <i class="iconfont icon-arrowRight"></i>
        </div>

    </div>
    <div class="menu-item no-right-img" v-if="user.registerOrigin!=91">
        <div class="left-box">
            <span class="menu-item-content">手机号码</span>
        </div>
        <div class="right-box">
            <span class="text-info text-renzheng">{{sub(user.userMobileNo,3,4,4)}}</span>
        </div>
    </div>
    <div class="menu-item no-right-img" v-if="user.registerOrigin==91">
        <div class="left-box">
            <span class="menu-item-content">邮箱地址</span>
        </div>
        <div class="right-box">
            <span class="text-info text-renzheng" style="justify-content:flex-start;">{{user.userEmail}}</span>
        </div>
    </div>
    <div class="menu-item" @click="showPopup(2,true)" v-if="user.registerOrigin==91">
        <div class="left-box">
            <span class="menu-item-content">修改密码</span>
        </div>
        <div class="right-box">
            <span class="text-info text-renzheng">
            </span>
            <i class="iconfont icon-arrowRight"></i>
        </div>

    </div>
    <div class="menu-item" @click="goLink(true,true)">
        <div class="left-box">
            <span class="menu-item-content">实名认证</span>
        </div>
        <div class="right-box">
            <span class="text-info text-renzheng"><i v-if="user.userType==2" class="iconfont icon-duigouxuanzhong"></i>{{user.userType==2?'已认证':'未认证'}}</span>
            <i class="iconfont icon-arrowRight"></i>
        </div>
    </div>
    <!-- <div class="menu-item phone-item" @click="goLink(2)">
            <div class="left-box">
                <span class="menu-item-content">手机号码</span>
                <span class="text-info">136****8384</span>
            </div>
            <div class="right-box">
                <span class="text-info">更换绑定</span>
                <i class="iconfont icon-arrowRight"></i>
            </div>

    </div> -->
    <div :class="['brand-desc',{'close-brand-desc':!blockLink && ispopBoxLink,'animation-desc':blockLink}]">
        <div class="brand-desc-header">
            <div class="brand-desc-title">区块链地址</div>
            <div class="brand-desc-headerbtn" @click="showPopup(false,true)">
                <i class="iconfont icon-close"></i>
            </div>
        </div>
        <p class="info-text">区块链上持有藏品的唯一地址</p>
        <div class="brand-desc-content brand-desc-link">
            <p @click="onCopy" class="code">{{nftData.address || '上链中...'}}</p>
        </div>
    </div>
    <div :class="['brand-desc',{'close-brand-desc':!password && isPassword,'animation-desc':password}]">
        <div class="brand-desc-header">
            <div class="brand-desc-title">修改密码</div>
            <div class="brand-desc-headerbtn" @click="showPopup(2,true)">
                <i class="iconfont icon-close"></i>
            </div>
        </div>
        <div class="password-box">
            <p class="info-password"><span>原密码&emsp;</span><input type="password" maxlength="20" placeholder="输入当前密码" v-model="form.initPwd"></p>
            <p class="info-password"><span>新密码&emsp;</span><input type="password" maxlength="20" placeholder="8到20位字母、数字和符号" v-model="form.userPwd"></p>
            <p class="info-password"><span>确认密码</span><input type="password" maxlength="20" placeholder="再次输入确认" v-model="form.confirmPwd"></p>
            <button :class="{'sms-button-show':setPass}" @click="addOutLogin">完成</button>
        </div>
    </div>
    <div :class="['brand-desc',{'close-brand-desc':!infoDesc && ispopBoxDesc,'animation-desc':infoDesc}]">
        <div class="brand-desc-header">
            <div class="brand-desc-img">
                <i class="iconfont icon-sucess"></i>
                已实名认证
            </div>
            <div class="brand-desc-headerbtn" @click="showPopup(true,true)">
                <i class="iconfont icon-close"></i>
            </div>
        </div>
        <div class="brand-desc-content brand-desc-cont">
            <div class="info-name">
                <span class="left-lable">姓名</span>
                <span class="right-cont">
                    <i class="iconfont icon-iconfontanquan"></i>
                    信息安全保障中
                </span>
            </div>
            <p class="card-code">
                {{sub(user.userNickName,0,2)}}
            </p>
            <p class="info-name">
                <span class="left-lable lable-text">身份证号</span>
            </p>
            <p class="card-code">
                {{sub(user.userCardNo,1,1,16)}}
            </p>
        </div>
    </div>
    <pubilcPopBox :iscanle="iscanle" :content="errContent" :ispopshow="ispopshow" @callback="callback" :iscallback="iscallback">
    </pubilcPopBox>
</div>
</template>

<script>
import pubilcPopBox from '@/components/culture-gather/public-pop-box';
import {
    nftUserModifyPwd
} from '@/assets/api/getCaptchaUrl';
import {
    editTerminalUser,
} from '@/assets/api/index';
import {
    nftUser,
    withAllSecurity
} from '@/assets/api/gateway';
import {
    Toast
} from 'vant';
import 'vant/es/toast/style';
import encrypt from '@/utils/encrypt.js';
import Upload from 'cube-ui/src/components/upload/upload.vue'
import userPic from '../../assets/images/culture-gather/user-pic.png'
export default {
    name: 'culturePersonalDetail',
    components: {
        pubilcPopBox,
        Upload,
    },
    data() {
        return {
            form: {
                userName: '',
                userHeadImgUrl: "",
                userPwd: '',
                confirmPwd: '',
                initPwd: '',
            },
            file: [{
                name: "",
                size: "",
                url: '',
                status: 'ready'
            }],
            user: {},
            blockLink: false,
            infoDesc: false,
            ispopBoxDesc: false,
            isPassword: false,
            password: false,
            ispopBoxLink: false,
            ispopshow: false,
            errContent: '',
            iscanle: false,
            iscallback: () => {},
            nftData: {},
            userPic,
            isOutLogin: false,
        }
    },
    created() {
        // if (typeof window.whySDK == 'object') {
        //     this.isOutLogin = true
        // }
        this.getUser();
    },
    computed: {
        setPass() {
            if (this.form.initPwd && this.form.userPwd && this.form.confirmPwd) {
                return true
            } else {
                return false;
            }
        }
    },
    methods: {
        addOutLogin() {
            if (this.form.initPwd == '') {
                this.ispopshow = true;
                return this.errContent = '请输入客服提供的初始密码';
            }
            if (this.form.userPwd == '') {
                this.ispopshow = true;
                return this.errContent = '请输入新密码';
            }
            let reg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,20}$/;
            if (!reg.test(this.form.userPwd)) {
                this.ispopshow = true;
                return this.errContent = '必须是8-20位字母、数字或字符，至少包含两种';
            }
            if (this.form.confirmPwd == '') {
                this.ispopshow = true;
                return this.errContent = '请再次输入新密码';
            }
            if (this.form.userPwd !== this.form.confirmPwd) {
                this.ispopshow = true;
                return this.errContent = '两次输入的新密码不致';
            }
            let obj = {
                initPwd: encrypt.Encrypt(this.form.initPwd),
                userPwd: encrypt.Encrypt(this.form.userPwd),
                confirmPwd: encrypt.Encrypt(this.form.confirmPwd),
                shopPath: this.$route.params.shopPath,
            }
            nftUserModifyPwd(obj).then(res => {

                if (res.status != 200) {
                    this.ispopshow = true;
                    return this.errContent = res.errMsg
                }
                const _data = res.data || '修改成功';
                this.ispopshow = true;
                this.titlepic = true;
                this.errContent = `${_data}`;
                this.iscallback = () => {
                    window.localStorage.removeItem('jwtToken');
                    window.localStorage.removeItem('userType');
                    this.$router.push({
                        name: 'overseasLogin',
                        query: {
                            name: 'cultureUserCenter'
                        }
                    });

                }
            })
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
        onCopy() {
            let input = document.createElement('input')
            input.id = 'copy-input'
             input.readOnly = 'readOnly' // 防止ios聚焦触发键盘事件
            input.style.position = 'absolute'
            input.style.left = '-2000px'
            input.style.zIndex = '-2000'
            document.body.appendChild(input)
            input.value = this.nftData.address;
            // ios必须先选中文字且不支持 input.select();
            this.selectText(input, 0, this.nftData.address.length)
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
                    icon: 'passed'
                });
            }
            input.blur();

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
        getUserInfo() {
            let token = window.localStorage.getItem("jwtToken") || ''
            let query = {
                shopPath: this.$route.params.shopPath,
                token: encrypt.Encrypt(JSON.stringify({
                    token,
                    timeStamp: Date.parse(new Date())
                }))
            };
            withAllSecurity(query).then(res => {
                if (res.status != 200) {
                    return
                }
                let data = encrypt.decodeAesString(res.data || {});
                console.log(data, 'dddddd')
                this.user = data;
                this.file[0].url = this.user.userHeadImgUrl || this.userPic;
                this.form.userName = this.user.userName || this.sub(this.user.userMobileNo, 3, 4, 4);
                this.form.userHeadImgUrl = this.user.userHeadImgUrl;
            })
        },
        getUser() {
            this.getUserInfo();
            this.getNftUrl();
        },
        sub(str, startLength, endLength, num) {
            return encrypt.subText(str, startLength, endLength, num)
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
        showPopup(params, bool = false) {
            if (!params) {
                this.blockLink = !this.blockLink
                this.infoDesc = false;
                this.ispopBoxLink = bool;
            } else {
                if (params == 1) {
                    this.infoDesc = !this.infoDesc
                    this.blockLink = false;
                    this.ispopBoxDesc = bool;
                } else if (params == 2) {
                    this.password = !this.password;
                    this.isPassword = bool;
                }

            }
        },
        callback(el) {
            if (el) {
                this.iscallback();
            }
            this.ispopshow = false;
            this.iscallback = () => {};
        },
        goLink(params, type) {
            let obj = {
                1: 'creatBlockChain',
            };
            if (this.user.userType != 2) {
                return this.$router.push({
                    name: obj[1],
                    query: {
                        name: "cultureUserCenter"
                    }
                })
            }
            this.showPopup(params, type)

        },
        clear() {
            this.form.userName = ""
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
                that.form.userHeadImgUrl = res.url + '?x-oss-process=image/resize,w_150,h_150';
            });
        },
        submit() {
            if (this.form.userName == '') {
                this.ispopshow = true;
                return this.errContent = '请输入昵称';
            }
            if (this.form.userHeadImgUrl == '') {
                this.ispopshow = true;
                return this.errContent = '请上传头像';
            }
            let obj = {
                userName: this.form.userName,
                userSex: this.user.userSex,
                userEmail: this.user.userEmail,
                userHeadImgUrl: this.form.userHeadImgUrl,
                shopPath: this.$route.params.shopPath,
            }
            editTerminalUser(obj).then(res => {
                if (res.status != 200) {
                    this.ispopshow = true;
                    return this.errContent = res.errMsg;
                }
                this.ispopshow = true;
                this.errContent = '保存成功！';
                this.iscallback = () => {
                    this.$router.push({
                        name: 'cultureUserCenter'
                    })
                };
            })
        }
    },
}
</script>

<style lang="scss">
@import '../../styles/tiangong/commen.scss';
@import '../../styles/tiangong/personal-data.scss';
</style>
