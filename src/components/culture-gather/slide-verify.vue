<template>
<div class="slide-verify">
    <Vcode :show="isShow" @success="success" :imgs="imgList" @fail="fails" @close="closeRe" />
    <!-- 其中@success是验证成功之后的回调 -->
</div>
</template>

<script>
import Vcode from "vue-puzzle-vcode"; //页面内引用插件
import {
    Toast
} from 'vant';
export default {
    data() {
        return {
            imgList: [
                'https://culturecloud.oss-accelerate.aliyuncs.com/sh/2022101910/1.jpg',
                'https://culturecloud.oss-accelerate.aliyuncs.com/sh/2022101910/2.jpg',
                'https://culturecloud.oss-accelerate.aliyuncs.com/sh/2022101910/3.jpg',
                'https://culturecloud.oss-accelerate.aliyuncs.com/sh/2022101910/4.jpg',
                'https://culturecloud.oss-accelerate.aliyuncs.com/sh/2022101910/5.jpg',
                'https://culturecloud.oss-accelerate.aliyuncs.com/sh/2022101910/6.jpg',
                'https://culturecloud.oss-accelerate.aliyuncs.com/sh/2022101910/7.jpg',
                'https://culturecloud.oss-accelerate.aliyuncs.com/sh/2022101910/8.jpg',
                'https://culturecloud.oss-accelerate.aliyuncs.com/sh/2022101910/9.jpg',
                'https://culturecloud.oss-accelerate.aliyuncs.com/sh/2022101910/10.jpg',
            ],
            isShow: false, // 用来控制显示是否显示图片滑动验证框
            photoHua: 0, //图片滑动验证的错误次数
        }
    },
    //挂载组件
    components: {
        Vcode,
        Toast
    },
    //方法部分
    methods: { // 用户通过了验证
        // 成功的回调
        success() {
            this.isShow = false; // 通过验证后，关闭图片验证弹出框，让用户继续填写验证码
            Toast({
                message: '请认证填写验证码',
                icon: 'passed'
            });
        },
        //失败的回调，失败的逻辑是，用户失败指定次数之后，加入弹窗提示信息
        fails() {
            this.photoHua += 1;
            if (this.photoHua > 5) {
                Toast({
                    message: '你要是一直拼不成功，我会让你一直拼下去的哟...',
                    icon: 'close'
                });
            }

        },
        //点击图片验证的背景部分事件
        closeRe() {
            Toast({
                message: '请完成滑动验证',
                type: 'fail'
            });
        },
    }
}
</script>

<style scoped>

</style>
