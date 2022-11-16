<template>
<div class="qrCodeIndex">
    <img :src="link" class="img-box">
    <!-- <div class="share-box-native">
        <button @click="call()">通用分享</button>
        <button @click="call('wechatFriend')">微信好友</button>
        <button @click="call('wechatTimeline')">朋友圈</button>
        <button @click="call('qqFriend')">QQ</button>
        <button @click="call('qZone')">QQ空间</button>
        <button @click="call('weibo')">微博</button>
        <button @click="setTitle('fa-ge NativeShare')">设置标题</button>
    </div> -->
    <div class="btn-box">
        <img src="../../assets/images/tiangong/andrio.png" alt="" @click="addlink(0)">
        <img src="../../assets/images/tiangong/iphoto.png" alt="" @click="addlink(1)">
    </div>
</div>
</template>

<script>
import {
    is_weixin
} from "@/utils/index"
export default {
    name: 'qrCodeIndex',
    data() {
        return {
            nativeShare: null,
            link: 'https://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/sh/sh/nftImage/20220908095923JtHuqvwv0RCVRF8wK1lj.png'
        }
    },
    created() {
        // this.nativeShare = new NativeShare()
        console.log(this.nativeShare,'ssssssssss')
        var shareData = {
            title: '分享标题',
            desc: '描述内容',
            // 如果是微信该link的域名必须要在微信后台配置的安全域名之内的。
            link: window.location.href,
            icon: 'http://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/sh/sh/nftImage/20220929105130iQX8RH83omrw7UxYOWO7_750_500.png',
            // 不要过于依赖以下两个回调，很多浏览器是不支持的
            success: function () {
                alert('success')
            },
            fail: function () {
                alert('fail')
            }
        }
        this.nativeShare.setShareData(shareData)
    },
    methods: {
        call(command) {
            try {
                this.nativeShare.call(command)
            } catch (err) {
                // 如果不支持，你可以在这里做降级处理
                alert(err.message)
            }
        },
        setTitle(title) {
            this.nativeShare.setShareData({
                title: title,
            })
        },
        addlink(val) {
            if (val) {
                window.location.href = "https://itunes.apple.com/cn/app/id847126070?mt=8"
            } else {
                window.location.href = "https://culturecloud.oss-cn-hangzhou.aliyuncs.com/apk/app/CultureCloud_release_v5.1.3.apk"
            }
        },
        urlToBase64(url) {
            return new Promise((resolve, reject) => {
                let image = new Image();
                image.onload = function () {
                    let canvas = document.createElement('canvas');
                    canvas.width = 750;
                    canvas.height = 1241;
                    // 将图片插入画布并开始绘制
                    canvas.getContext('2d').drawImage(image, 0, 0);
                    // result
                    let result = canvas.toDataURL('image/png')
                    resolve(result);
                };
                // CORS 策略，会存在跨域问题https://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror
                // 虽然设置了image.crossOrigin来解决跨域问题，但有时候还是会出现跨域错误，这是因为图片url的缓存
                image.setAttribute('crossOrigin', 'anonymous');
                // 需要加个随机数防止缓存即可
                image.src = url + '?v=' + Math.random()
                // 图片加载失败的错误处理
                image.onerror = () => {
                    reject(new Error('urlToBase64 error'));
                }
            })
        },
        //下载
        downloadIamge(fileName, content) {
            if (is_weixin()) {
                return true;
            }

            let aLink = document.createElement('a');
            this.urlToBase64(content).then(res => {
                let blob = this.base64ToBlob(res); //new Blob([content]);
                let evt = document.createEvent("HTMLEvents");
                evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
                aLink.download = fileName;
                aLink.href = URL.createObjectURL(blob);
                aLink.click()
            })

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
    }
}
</script>

<style lang="scss" scoped>
* {
    padding: 0;
    margin: 0;
}

.qrCodeIndex {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    background: #000;
    pointer-events: all;
    flex-direction: column;
    position: relative;

    .img-box {
        width: 100%;
        height: auto;
        pointer-events: all;
    }

    .btn-box {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: -200px;

        img {
            width: 40%;
            margin-right: 20px;

            &:last-of-type {
                margin-right: 0;
            }
        }
    }
}
</style>
