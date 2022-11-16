<template>
<div class="inviteFriends-container-tt">
    <div>
        <h3 class="inviteFriends-title-tt">
            <i class="iconfont icon-ARROW-left-copy" @click="goHome"></i>
            <span @click="addLink">邀请记录 <i class="iconfont icon-arrowRight"></i></span>
        </h3>
        <div class="inviteFriends-body-tt">
            <canvas class="qrcode" ref="inviteQrcode" v-if="!newSrc"></canvas>
            <canvas ref="inviteCanvas" class="invite-canvas" v-if="!newSrc"></canvas>
            <img class="invite-img" :src="newSrc" alt="" v-else @click.stop.prevent="(false)">
        </div>
        <p class="inviteFriends-footer-title">分享到</p>
        <div class="inviteFriends-footer-tt">
            <button>
                <img :src="footerImg.wechat" alt="" @click="addPop">
                微信
            </button>
            <button>
                <img :src="footerImg.circleFriends" alt="" @click="addPop">
                朋友圈
            </button>
            <button>
                <img :src="footerImg.copy" alt="" @click="onCopy(invitationContent,true)">
                复制链接
            </button>
            <button @click.stop="downloadImage('天工严选')">
                <img :src="footerImg.save" alt="">
                保存图片
            </button>
        </div>
        <div class="inviteFriends-zhezhao" v-if="isWxStats" @click.stop="isWxStats=false">
            <img :src="footerImg.zhezhao" alt="">
        </div>
    </div>
    <div class="inviteFriends-loading" v-if="isLoading">
        <img src="https://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/2022103117/loading.gif" alt="">
    </div>
</div>
</template>

<script>
import QRCode from "qrcode";
import encrypt from '@/utils/encrypt.js';
import imgUrl from '@/assets/images/tiangong/inviteFriends.png';
import {
    WeChat
} from '@/plugins/mixin';
import {
    Toast
} from 'vant';
import 'vant/es/toast/style';
import {
    withAllSecurity,
} from '@/assets/api/gateway';
export default {
    name: 'inviteFriends',
    components: {
        QRCode
    },
    mixins: [WeChat],
    data() {
        return {
            qrCodeUrl: new Image(),
            invitationUrl: '',
            invitationContent: '天工严选数字藏品平台，有趣好玩，活动多多，精品多多，值得关注！赶快注册：',
            context: {},
            img: new Image(),
            newSrc: '',
            imgUrl,
            user: {},
            isWxStats: false,
            isLoading: true,
            footerImg: {
                zhezhao: 'https://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/202211113/zhezhao.png',
                save: 'https://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/202211110/save.png',
                wechat: 'https://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/202211110/wechat.png',
                copy: 'https://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/202211110/copy.png',
                circleFriends: 'https://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/202211110/circleFriends.png',
            }
        }
    },
    created() {
        this.img.src = this.imgUrl;
        this.getDetail();
        this.publicShare({
            shareTitle: '天工严选数藏',
            shareImgUrl: 'https://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/sh/sh/H5/20220814214102aZDUfVhz0NQQ2dDfDDk9.png',
            shareDesc: '“天工严选”数字藏品依托文化云，致力打造全球领先的数字藏品综合服务平台。'
        })
    },
    methods: {
        addPop() {
            return Toast({
                message: '请使用浏览器的默认分享',
                icon: 'fail'
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
        isWx() {
            const ua = navigator.userAgent.toLowerCase();
            return ua.match(/MicroMessenger/i) == 'micromessenger';
        },
        //下载
        downloadImage(fileName) {
            if (this.isWx()) {
                return this.isWxStats = true;
            }
            let aLink = document.createElement('a');
            let evt = document.createEvent("HTMLEvents");
            evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
            aLink.download = fileName;
            aLink.href = this.newSrc;
            aLink.click()

        },
        //base64转blob
        base64ToBlob(code) {
            let parts = code.split(';base64,');
            let contentType = parts[0].split(':')[1];
            let raw = window.atob(parts[1]);
            let rawLength = raw.length;

            let uInt8Array = new Uint8Array(rawLength);

            for (let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }
            return new Blob([uInt8Array], {
                type: contentType
            });
        },
        sub(str, startLength, endLength, num) {
            return encrypt.subText(str, startLength, endLength, num)
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
                let url = localUrl;
                this.invitationUrl = url;
                this.invitationContent += url;
                this.$nextTick(() => {
                    this.initDraw();
                })
                // userType 实名认证 1未提交,2通过,3未审核,4审核不通过    通过和审核中不能修改信息
            });
        },
        initDraw() {
            let qrcode = this.$refs.inviteQrcode;
            QRCode.toCanvas(qrcode, this.invitationUrl, { //暂时没发现有啥用
                width: 0, //二维码的宽
                height: 0,
                margin: 4,
            }, (error) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log("success!");
                }
            });
            this.qrCodeUrl.src = qrcode.toDataURL('images/png', 1);
            let canvas = this.$refs.inviteCanvas;
            this.context = canvas.getContext('2d');
            let w = this.img.width;
            let h = this.img.height;
            console.log(w, h, "dssssss");
            canvas.width = w;
            canvas.height = h;
            let left = w / 2 - (this.qrCodeUrl.width / 2);
            this.context.drawImage(this.img, 0, 0, w, h);
            let tel = this.sub(this.user.userMobileNo, 3, 4, 4);
            let str = '邀请人：' + tel
            setTimeout(() => {
                this.context.font = "26px '微软雅黑'";
                this.context.fillStyle = '#86D4E9';
                this.context.fillText(str, 228, h - 190)
                this.context.drawImage(this.qrCodeUrl, 200, h - 550, 310, 310);
                this.newSrc = canvas.toDataURL('images/png', 1);
                this.isLoading = false;
            })
        },
        goHome() {
            this.$router.go(-1)
        },
        addLink() {
            this.$router.push({name:'invitedRecord'})
        },
    },

}
</script>

<style lang="scss">
@import '../../styles/tiangong/commen.scss';
</style><style lang="scss" scoped>
@import '../../styles/tiangong/inviteFriends.scss';
</style>
