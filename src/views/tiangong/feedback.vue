<template>
<div class="culture-setting">
    <div class="add-feedback-con">
        <div class="input-info">
            <textarea @blur="addblur" placeholder="请描述您遇到的问题或对平台意见" maxlength="200" v-model="postData.feedContent"></textarea>
            <div class="txt-length">{{postData.feedContent.length}}/200</div>
        </div>
        <div class="upload-box">
            <Uploader upload-icon="van-icon iconfont icon-ic_join_dialing_norm" :multiple="true" :max-count="9" accept="image/*" @oversize="isOverSize" :max-size="20 * 1024 * 1024" v-model="files" :after-read="afterRead" />
        </div>
        <div class="footer">
            <div class="password-login zhanghao">
                <button @click="onCancel">取消</button>
            </div>
            <div class="password-login duanxin">
                <button @click="submit">
                    提交</button>
            </div>
        </div>
    </div>
    <div class="info-box">
        <p>如有任何疑问，请联系我们的客服</p>
        <p>
            <i class="iconfont icon-24gl-phoneLoudspeaker"></i>客服电话<a href="tel:02136696098-8125">02136696098-8125</a>
        </p>

    </div>
    <pubilcPopBox :iscallback="iscallback" :iscanle="iscanle" :content="errContent" :ispopshow="ispopshow" @callback="callback">
    </pubilcPopBox>
</div>
</template>

<script>
import {
    addFeedback
} from '@/assets/api/gateway';
import pubilcPopBox from '@/components/culture-gather/public-pop-box';
import {
    Uploader
} from 'vant';
export default {
    name: 'cultureFeedback',
    components: {
        pubilcPopBox,
        Uploader,
    },
    data() {
        return {
            isAddFeedback: true,
            postData: {
                feedContent: '',
                feedImgUrl: '',
                feedType: 'FEEDBACK_NFT'
            },
            isData: false,
            files: [],
            ispopshow: false,
            errContent: '',
            iscanle: false,
            user: {},
            iscallback: () => {}
        }
    },
    methods: {
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
        callback(el) {
            if (el) {
                this.iscallback();
            }
            this.ispopshow = false;
            this.iscallback = () => {};
        },
        isOverSize(file) {
            var maxSize = 10 * 1024 * 1024; // 5M
            let str = '图片大小超过10M';
            this.ispopshow = true;
            return this.errContent = str;
        },
        afterRead(files) {
            var _this = this;
            if (files.length) {
                files.forEach(ele => {
                    ele.status = "uploading";
                    this.CooOss(ele.file).then(function (res) {
                        // ele.content = res.url;
                        ele.url = res.url;
                        ele.status = 'success';
                    });
                })
            } else {
                files.status = "uploading";
                this.CooOss(files.file).then(function (res) {
                    // files.content = res.url;
                    files.url = res.url;
                    files.status = 'success';
                });
            }
        },
        onCancel() {
            history.go(-1)
        },
        getImgs() {
            this.postData.feedImgUrl = (this.files.map(el => {
                return el.url;
            }) || []).toString();
        },
        submit() {
            if (!this.postData.feedContent.length) {
                this.ispopshow = true;
                return this.errContent = "请输入您反馈的问题"
            }
            this.getImgs();
            this.postData = {
                shopPath: this.$route.params.shopPath,
                ...this.postData
            }
            addFeedback(this.postData).then(res => {

                if (res.status != 200) {
                    this.ispopshow = true;
                    return this.errContent = res.errMsg;
                }
                this.ispopshow = true;
                this.errContent = '意见反馈成功';
                this.iscallback = () => {
                    this.$router.push({
                        name: 'cultureUserCenter'
                    })
                };
            });
        },

    },
}
</script>

<style lang="scss">
@import '../../styles/tiangong/commen.scss';
@import '../../styles/tiangong/feedback.scss';
</style>
