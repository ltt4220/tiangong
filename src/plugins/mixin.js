var wx = require('weixin-js-sdk') || window['wx']
import {
  getWxSign
} from '@/assets/api/getStore';
import {
  tradeWapPay
} from '@/assets/api/gateway';
export const WeChat = {
  data() {
    return {
      appWXinfo: {},
    };
  },
  methods: {
    isWx() {
      const ua = navigator.userAgent.toLowerCase();
      return ua.match(/MicroMessenger/i) == 'micromessenger';
    },
    //公共分享方法
    publicShare(shareData, bool = true) {
      const postData = {
        contentCode: '',
        matchMode: '',
        url: window.location.href,
        shopPath: this.$route.params.shopPath,
      };
      getWxSign(postData).then(res => {

        let data = res || {};
        this.appWXinfo = data;
        if (bool) {
          this.initWxConfig(data, shareData);
        } else {
          this.getTradeWapPay(data, shareData)
        }

      });
    },
    getTradeWapPay(resolve, orderData) {
      let query = {
        shopPath: this.$route.params.shopPath,
        orderId: orderData.id,
        orderType: 7,
        payType: 3,
        appId: resolve.appId
      }
      tradeWapPay(query).then(res => {
        if (res.status != 200) return;
        let data = res.data || {};
        return window.location.href = data.mwebUrl + '&redirect_url=' + encodeURIComponent(orderData.url);
      });
    },
    initWxConfig(resolve, { shareTitle, shareDesc, shareImgUrl, shareUrl = window.location.href }) {
      if (!this.isWx()) {
        return console.log('请在微信打开页面');
      }
      wx.config({
        beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: resolve.appId, // 必填，企业微信的corpID
        timestamp: resolve.timestamp, // 必填，生成签名的时间戳
        nonceStr: resolve.nonceStr, // 必填，生成签名的随机串
        signature: resolve.signature, // 必填，签名，见附录1
        jsApiList: ['previewImage', 'updateTimelineShareData', 'updateAppMessageShareData', 'onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'getNetworkType', 'getLocation'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        success: function (res) {
          console.log('config:success', res);
        },
        fail: function (res) {
          if (res.errMsg.indexOf('function not exist') > -1) {
            console.log('版本过低请升级');
          }
        }
      });
      wx.ready(function () {
        wx.onMenuShareAppMessage({
          title: shareTitle,
          desc: shareDesc,
          imgUrl: shareImgUrl,
          link: shareUrl || '',
          success: function () {
          }
        });
        wx.onMenuShareTimeline({
          title: shareTitle,
          imgUrl: shareImgUrl,
          success: function () {
          }
        });
        wx.updateAppMessageShareData({
          title: shareTitle, // 分享标题
          desc: shareDesc, // 分享描述
          link: shareUrl || '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
          imgUrl: shareImgUrl, // 分享图标
          success: function () {
            // 设置成功
          }
        })
        wx.updateTimelineShareData({
          title: shareTitle, // 分享标题
          link: shareUrl || '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
          imgUrl: shareImgUrl, // 分享图标
          success: function () {
            // 设置成功
          }
        })
        wx.onMenuShareQQ({
          title: shareTitle,
          desc: shareDesc,
          imgUrl: shareImgUrl,
          success() {

          }
        });
        wx.onMenuShareWeibo({
          title: shareTitle,
          desc: shareDesc,
          imgUrl: shareImgUrl,
          success() {

          }
        });
        wx.onMenuShareQZone({
          title: shareTitle,
          desc: shareDesc,
          imgUrl: shareImgUrl,
          success() {

          }
        });
      });
    },
  }
};

