<template>
<div class="add-comment-box">
    <h3 class="title">{{id?'回复评论':'写评论'}}</h3>
    <div class="comment-cont" v-if="id">
        <img :src="detail.userHeadImgUrl || userPic" alt="">
        <div class="right-box">
            <h3 class="info-box">
                {{detail.commentUserNickName}}&emsp;{{getCommentTime(detail.commentTime)}}
            </h3>
            <div class="info-body">{{detail.commentRemark}}</div>
        </div>
    </div>
    <div class="input-info-textarea">
        <textarea @blur="addblur" placeholder="请文明评论，评论通过审核之后才会显示。" v-model="replyContent" maxlength="200" cols="30" rows="10"></textarea>
        <div class="txt-length">{{replyContent.length}}/200</div>
    </div>
    <div class="foot-box">
        <button class="canle" @click="goBack">取消</button>
        <button class="comipte" @click="addSubmit">确定</button>
    </div>
    <pubilcPopBox :iscallback="iscallback" :content="errContent" :ispopshow="ispopshow" @callback="callback">
    </pubilcPopBox>
</div>
</template>

<script>
import {
    replyAdd,
    commentAdd
} from '@/assets/api/gateway';
import encrypt from "@/utils/encrypt.js";
import userPic from '../../assets/images/culture-gather/user-pic.png';
import pubilcPopBox from '@/components/culture-gather/public-pop-box';
export default {
    name: 'cultureAddComment',
    components: {
        pubilcPopBox,
    },
    data() {
        return {
            userPic,
            id: this.$route.query.id || '',
            commentRkId: this.$route.query.commentRkId || '',
            detail: {},
            ispopshow: false,
            errContent: '',
            iscallback: () => {},
            replyContent: ''
        }
    },
    created() {
        this.detail = JSON.parse(window.sessionStorage.getItem('commentInfo')) || {}
    },
    methods: {
        setTime(time, format, type) {
            return encrypt.transformation(time, format, type)
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
        addReplyAdd() {
            if (!this.replyContent) {
                this.ispopshow = true;
                return this.errContent = '评论内容不能为空';
            }
            let query = {
                shopPath: this.$route.params.shopPath,
                commentId: this.id,
                userType: 0,
                replyContent: this.replyContent
            };
            replyAdd(query).then(res => {
                console.log(res, 'dddd1111111dddd')
                if (res.status != 200) {
                    this.ispopshow = true;
                    return this.errContent = res.errMsg;
                }
                this.ispopshow = true;
                this.errContent = '回复评论成功，正在审核中~'
                return this.iscallback = () => {
                    this.goBack();
                }
            });
        },
        addCommentAdd() {
            if (!this.replyContent) {
                this.ispopshow = true;
                return this.errContent = '评论内容不能为空';
            }
            let query = {
                shopPath: this.$route.params.shopPath,
                commentId: this.id,
                commentType: 50,
                commentRemark: this.replyContent,
                commentRkId: this.commentRkId
            };
            commentAdd(query).then(res => {
                if (res.status != 200) {
                    this.ispopshow = true;
                    return this.errContent = res.errMsg;
                }
                this.ispopshow = true;
                this.errContent = '添加评论成功，正在审核中~'
                return this.iscallback = () => {
                    this.goBack();
                }
            });
        },
        callback(el) {
            if (el) {
                this.iscallback();
            }
            this.ispopshow = false;
            this.iscallback = () => {};
        },
        goBack() {
            window.sessionStorage.removeItem('commentInfo');
            window.history.back();
        },
        addSubmit() {
            if (this.id) {
                this.addReplyAdd();
            } else {
                this.addCommentAdd();
            }
        },

        getCommentTime(params) {
             if (String(params).indexOf('-') > -1 || String(params).indexOf('.') > -1) {
                params = params.replace(/\-|\./gi, '/');
            }
            const _now = Date.parse(new Date());
            const _commentTime = Date.parse(params);
            // 获取秒
            const _second = Math.ceil((_now - _commentTime) / 1000)
            if (_second < 60 && _second > 0) { // 60s以内，显示为：刚刚；
                return '刚刚'
            } else if (((_second / 3600) < 1) && _second >= 60) { // 1小时以内，显示为：x分钟前；
                return Math.floor(_second / 60) + '分钟前'
            } else if (((_second / 3600) >= 1) && ((_second / 3600) < 24)) { // 24小时以内，显示为：x小时前；
                return Math.floor(_second / 3600) + '小时前'
            } else if (((_second / 3600) >= 24) && ((_second / 3600) < 48)) { // 48小时内，显示为：昨天 00:00；
                const _hour = (Math.floor(_second / 3600) - 24) > 10 ? (Math.floor(_second / 3600) - 24) : '0' + (Math.floor(_second / 3600) - 24)
                const _minute = Math.floor((_second / 60) % 60) > 10 ? Math.floor((_second / 60) % 60) : '0' + Math.floor((_second / 60) % 60)
                return '昨天' + _hour + ':' + _minute
            } else if (((_second / 3600) >= 48)) { // 48小时以上，显示为：x月x日 00:00；
                return this.setTime(params, 'MM月DD日 HH:MM')
            } else { // 1年以上，显示为：x年x月x日；
                return this.setTime(params, 'YYYY年MM月DD日')
            }
        },
    },

}
</script>

<style lang="scss">
@import '../../styles/tiangong/commen.scss';
@import '../../styles/tiangong/addComment.scss';
</style>
