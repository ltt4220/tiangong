<template>
  <div :class="['cultureGatherDetail-box',{'cultureGatherDetail-wrap':isScroll && detailList.availableCount,'cultureGatherDetail-flash':isFlash,'cultureGatherDetail-noCount':!detailList.availableCount ||  detailList.spuOrderStatus==4 && detailList.availableCount || detailList.spuOrderStatus==1 || detailList.isMembers}]">
    <ul :class="['nav-box',{'fixed-stick-box':isFixed}]">
      <li v-for="(nav,n) in navList" :key="n" :class="{'active':navIdx==n}" @click.stop="changeNav(n)">{{nav.name}}</li>
    </ul>
    <div class="pop-box" v-lazy:background-image="detailbg"></div>
    <div class="detail-content" v-if="detailList.spuName">
      <detail3D :detailList="detailList" v-if="true"></detail3D>
      <detailVideo ref="videoDetail" :detailList="detailList" v-else></detailVideo>
      <div class="artist-box cont-info">
        <div class="head-describe">
          <div class="info">
            <h3>收藏价值</h3>
            {{detailList.spuSummary}}
          </div>
          <div class="count-down-box" v-if="detailList.spuOrderStatus==3" v-html="countDownBtn">
          </div>
        </div>
        <div class="img-describe" v-html="replaceAllImg(detailList.spuIntroduction)" v-lazy-container="{ selector: 'img' }"></div>
      </div>
      <div class="equity-box cont-info">
        <h3>权益说明</h3>
        <div class="collection-commondesc-content" v-html="handleText(detailList.spuRightsDescription)" v-lazy-container="{ selector: 'img' }">
        </div>
      </div>
      <div class="comments-box cont-info">
        <h3 class="title-box">评论 <span>{{total}}</span><span class="comment-right" @click="addLink(2)"><i class="iconfont icon-xiepinglun1"></i>写评论</span></h3>
        <ul class="comment-list" v-if="isListBool==1">
          <li v-for="(item,i) in commentList" :key="i" class="list-item">
            <img :src="item.userHeadImgUrl || userPic" alt="" class="pic">
            <div class="right-box">
              <h3 class="info-box">
                <p>{{item.commentUserNickName}}&emsp;{{getCommentTime(item.commentTime)}}</p><i class="iconfont icon-pinglun2" @click="addLink(2,item)"></i>
              </h3>
              <div class="info-body">{{item.commentRemark}}</div>
              <ul class="child-comment">
                <li class="child-item" v-for="(ele,e) in item.commentReplyList" :key="e">
                  <div class="chiild-right-box">
                    <h3 class="child-info-box">
                      <img :src="ele.replyHeadImgUrl || userPic" alt="" class="child-pic">{{ele.replyUserNickName}}&emsp;回复
                    </h3>
                    <div class="child-info-body">{{ele.replyContent}}</div>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <p class="text-info-box" v-else-if="isListBool==2"><i class="iconfont icon-meiyoushuju"></i>暂无评论</p>
        <p class="more-box" v-if="total>8"><button @click="addLink(1,{commentId:id})">更多评论 ></button></p>
      </div>
    </div>
    <div class="footer-box" ref="footBox" v-if="detailList.spuName">
      <div class="tilp-box" :style="{display:isFixed?'none':'flex'}">
        <i class="iconfont icon-arrowDT"></i>
      </div>
      <div class="button-left">
        <p class="price">
          <a v-html="getPrice(detailList)"></a>
          <a v-if="detailList.spuOrderStatus==2 && !detailList.isMembers || detailList.spuOrderStatus==3 && !detailList.isMembers">限量<i class="big">{{detailList.spuStock}}</i>份</a>
          <a v-else>库存<i class="big">{{detailList.spuOrderStatus==1?0:detailList.availableCount}}</i>份</a>
        </p>
      </div>
      <div :class="['button-right',{'availableCount':!detailList.availableCount || detailList.spuOrderStatus==1}]" @click="goBuy(detailList)">
        <button><span>{{detailList | setButton}}</span></button>
        <p v-if="detailList.spuOrderStatus==2 && !detailList.isMembers || detailList.spuOrderStatus==3 && !detailList.isMembers">{{setTime(detailList.spuStartTime, 'MM月DD日 HH:MM')}} 开售</p>
      </div>
    </div>
    <pubilcPopBox :iscallback="iscallback" :iscanle="iscanle" :content="errContent" :ispopshow="ispopshow" @callback="callback">
    </pubilcPopBox>
  </div>
</template>

<script>
import {
    spuDetail,
    commentList,
    orderBook
} from '@/assets/api/gateway';
import {
    WeChat
} from '@/plugins/mixin';
import encrypt from "@/utils/encrypt.js"
import pubilcPopBox from '@/components/culture-gather/public-pop-box';
import detail3D from '@/components/culture-gather/detail-3D';
import detailVideo from '@/components/culture-gather/detail-video';
import userPic from '../../assets/images/culture-gather/user-pic.png';
import detailbg from '../../assets/images/tiangong/detailbg.png';
let isTap = false
let scrollTimer = null
export default {
    name: 'cultureGatherDetail',
    components: {
        pubilcPopBox,
        detail3D,
        detailVideo,
    },
    mixins: [WeChat],
    inject: ['reload'],
    data() {
        return {
            navList: [{
                name: '藏品'
            }, {
                name: '详情'
            }, {
                name: '权益'
            }, {
                name: '评论'
            }],
            navIdx: 0,
            detailList: {
                recentBuyerList: []
            },
            // 秒杀倒计时
            countDown: 0,
            // 秒杀倒计时按钮
            countDownBtn: '',
            id: this.$route.query.id || '',
            user: {
                userId: '',
                userMobileNo: '',
                userType: ''
            },
            ispopshow: false,
            errContent: '',
            iscanle: false,
            userPic,
            detailbg,
            isScroll: 0,
            iscallback: () => {},
            isFixed: false,
            setTopList: [],
            canRun: null,
            isFlash: false,
            commentList: [],
            query: {
                page: 1,
                rows: 8,
                shopPath: this.$route.params.shopPath,
                commentRkId: this.$route.query.id || '',
            },
            total: 0,
            time: null,
            myviewer: null,
            routerEnter: false,
            userType: '',
            userToken: '',
            isSmallTop: false,
            isListBool: false,
            isOrderShow: true,
        }
    },
    created() {
        this.init();
        window.addEventListener('scroll', this.throttle(this.handelScrll, 300), false);
    },
    beforeRouteEnter(to, from, next) {
        if (typeof window.whySDK == 'object' && typeof whySDK.scrollPage == 'function') {
            whySDK.scrollPage();
        }
        if (from.name && from.name == "cultureSubscribe") {
            return next(vm => {
                vm.init()
            })
        }
        next();
    },
    methods: {
        setTime(time, format, type) {
            return encrypt.transformation(time, format, type)
        },
        subUserInfoCallBack() {
            // if (typeof window.whySDK == 'object' && typeof whySDK.getUserInfo == 'function') {
            //     whySDK.getUserInfo();
            // } else {
            //     this.getUser();
            // }
            this.getUser();
        },
        getUserInfo(user) {
            localStorage.setItem('jwtToken', user.jwtStr || '');
            localStorage.setItem('userType', user.userType || '');
            this.userToken = window.localStorage.getItem("jwtToken");
            this.userType = window.localStorage.getItem("userType");
        },
        init() {
            this.subUserInfoCallBack();
            window['ct_commonCallbackFromNative'] = (result, status) => {
                console.log(result, status, 'result, status')
                //result, status 参数对应的状态
                //"getUserInfo", "json" 用户数据
                //"wechatKefu", "json" 用户数据
                let data = status ? JSON.parse(status) : {};
                if (result == "getUserInfo") {
                    this.getUserInfo(data)
                }

            }
            let _height = document.documentElement.clientHeight || document.body.clientHeight;
            this.isSmallTop = _height && _height <= 1300;
            this.getList();
            this.addCommentList();

        },
        replaceAllImg(html) {
            if (!html) return ''
            var newContent = html.replace(/<img[^>]*>/gi, function (str, capture) {
                var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
                var url = str.match(srcReg);
                var mat = str.replace(/src=\"(.*)\"/gi, 'data-src=' + url[1]);
                return mat;
            });
            return newContent;
        },
        addCommentList() {
            commentList(this.query).then(res => {
                if (res.status != 200) {
                    return this.isListBool = 2
                }
                let data = res.data || {};
                this.total = data.count;
                this.commentList = data.list || [];
                if (this.commentList.length) {
                    this.isListBool = 1
                } else {
                    this.isListBool = 2
                }
            });
        },
        addLink(type = 1, item = {}) {
            let obj = {
                1: 'cultureComments',
                2: 'cultureAddComment'
            }
            if (type == 2) {
                // 判断是否登录
                if (!this.userToken) {
                    return this.getUser(true)
                }
                window.sessionStorage.removeItem('commentInfo');
                window.sessionStorage.setItem('commentInfo', JSON.stringify(item))
            }

            this.$router.push({
                name: obj[type],
                query: {
                    id: item.commentId,
                    commentRkId: this.id
                }
            });
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
        changeNav(i) {
            const wraps = document.querySelectorAll('.detail-content .cont-info')
            document.documentElement.scrollTop = document.body.scrollTop = wraps[i].offsetTop - 120
            this.navIdx = i
            isTap = true
        },
        throttle(fn, interval = 300) {
            var canRun = true;
            return function () {
                if (!canRun) return;
                canRun = false;
                setTimeout(() => {
                    fn.apply(this, arguments);
                    canRun = true;
                }, interval);
            };
        },
        handelScrll() {
            const scrollTop = document.body && document.body.scrollTop || document.documentElement && document.documentElement.scrollTop;
            if (scrollTop) {
                if (!this.isScroll) {
                    this.isScroll = true;
                }
                const _height = document.documentElement.clientHeight || document.body.clientHeight;
                const sub = _height - 430;
                const wraps = document.querySelectorAll('.detail-content .cont-info')
                if (!isTap) {
                    for (let i = wraps.length - 1; i >= 0; i--) {
                        const el = wraps[i]
                        if (scrollTop >= el.offsetTop - 120 && i > 0) {
                            this.navIdx = i
                            break
                        }
                    }
                }
                if (scrollTop > sub) {
                    this.isFixed = true;
                    this.isFlash = false;
                } else {
                    this.isFixed = false;
                }
                var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                // 滚动到底部
                if (scrollTop + _height + 1 >= scrollHeight && !isTap) {
                    if (this.navIdx !== 3) this.navIdx = 3
                }
                clearTimeout(scrollTimer);
                scrollTimer = setTimeout(() => {
                    isTap = false
                }, 400);
            } else {
                this.navIdx = 0;
                if (this.isScroll) {
                    this.isScroll = false;
                }
                this.isFixed = false;
                this.isFlash = true;
            }
        },
        getUser(bool = false) {
            if (bool) {
                // if (typeof window.whySDK == 'object' && typeof whySDK.userLogin == 'function') {
                //     whySDK.userLogin();
                // } else {
                //     this.$router.push({
                //         name: 'cultureGatherLogin',
                //         query: {
                //             name: 'cultureGatherDetail',
                //             ...(this.$route.query || {})
                //         }
                //     })
                // }
                this.$router.push({
                    name: 'cultureGatherLogin',
                    query: {
                        name: 'cultureGatherDetail',
                        ...(this.$route.query || {})
                    }
                })

            } else {
                this.userToken = window.localStorage.getItem("jwtToken") || ''
                this.userType = window.localStorage.getItem("userType") || '';
            }
        },
        handleAvailableCount() {
            let twenty = '20%'
            let scaleResult = this.percentage || ""
            let percentResult = Number(scaleResult) < Number(twenty.replace("%", ""))
            return percentResult ? `仅剩` : `剩余`
        },
        callback(el) {
            if (el) {
                this.iscallback();
            }
            this.ispopshow = false;
            this.iscallback = () => {};
        },
        getList(bool = true) {
            let query = {
                shopPath: this.$route.params.shopPath,
                spuId: this.id,
            };
            spuDetail(query).then(res => {
                if (res.status != 200) {
                    return
                }
                this.detailList = res.data || {};
                this.publicShare({
                    shareTitle: this.detailList.spuShareTitle,
                    shareImgUrl: this.detailList.spuShareImage,
                    shareDesc: this.detailList.spuShareDescription
                })
                if (this.detailList.spuOrderStatus == 3) {
                    this.handleDelayTimer();
                }
            });
        },
        //预售
        addOrderBook(supId) {
            if (this.isOrderShow) {
                let obj = {
                    supId,
                    shopPath: this.$route.params.shopPath,
                };
                this.isOrderShow = false;
                orderBook(obj).then(res => {
                    if (res.status != 200) {
                        this.isOrderShow = true;
                        this.ispopshow = true;
                        return this.errContent = res.errMsg;
                    }
                    this.$router.push({
                        'name': 'cultureSubscribe',
                        query: {
                            id: supId
                        }
                    })
                })
            }

        },
        // 去购买
        goBuy(detail) {
            // 判断是否登录
            if (!this.userToken) {
                return this.getUser(true)
            }
            if (detail.availableCount === 0) {
                return;
            }
            if (detail.curTime > detail.endTime) { //已结束
                return
            }
            // 判断是否实名认证
            if (this.userType != 2) {
                return this.$router.push({
                    name: 'creatBlockChain',
                    query: {
                        id: this.id
                    }
                });
            }
            //判断是否预售
            if (detail.spuOrderStatus == 2 && !detail.isMembers || detail.spuOrderStatus == 3 && !detail.isMembers) {
                if (detail.bookStatus) { //已预售
                    return
                } else { //未预售
                    return this.addOrderBook(detail.spuId)
                }
            }
            //下单
            return this.$router.push({
                name: 'cultureSubmitBox',
                query: {
                    id: this.id,
                    isMembers: detail.isMembers
                }
            });
        },
        handleDelayTimer() {
            clearInterval(this.timer);
            this.delayTimer();
            return this.timer = setInterval(() => {
                if (this.countDown <= 0) {
                    this.countDown = 0
                    clearInterval(this.timer);
                    return
                }
                this.countDown -= 1000;
                this.delayTimer()
            }, 1000)
        },
        delayTimer() {
            let spuStartTime = this.detailList.startTime;
            let currentDate = this.detailList.curTime;
            let mss = this.countDown || spuStartTime - currentDate; //毫秒差
            if (mss <= 0) {
                clearInterval(this.timer);
                return this.reload();
            }
            this.countDown = mss;
            var days = parseInt(mss / (1000 * 60 * 60 * 24));
            var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = parseInt((mss % (1000 * 60)) / 1000);
            if (hours < 10) {
                hours = '0' + hours;
            }
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            let newsDay = days ? ` <div class="list-item"><span>${days}</span>天</div>` : '';
            this.countDownBtn =
                `
                <div class="countdown-list">
                    ${newsDay}
                    <div class="list-item"><span>${hours}</span>时</div>
                    <div class="list-item"><span>${minutes}</span>分</div>
                    <div class="list-item"><span>${seconds}</span>秒</div>
                </div>`
        },
        getPrice({
            spuPayMethod,
            spuOriginalPrice
        }) {
            const payTypeObj = {
                0: '<span class="small">免费</span>',
                1: `<i class="lab">￥</i><span>${spuOriginalPrice ? spuOriginalPrice.toFixed(2) : '0.00'}</span>`
            }
            return payTypeObj[spuPayMethod]
        },
        handleText(text) {
            let str = text || ''
            str = this.replaceAllImg(str)
            str = str.replace(/\n/g, '<br/>')
            return str
        }
    },
    destroyed() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    filters: {
        setButton({
            availableCount,
            spuOrderStatus,
            bookStatus,
            isMembers
        }) {
            let str = "";
            if (isMembers) {
                if (availableCount == 0 || spuOrderStatus == 1) {
                    return str = '已售罄'
                }
                return str = '立即抢购'
            } else {
                if (spuOrderStatus == 2 || spuOrderStatus == 3) {
                    if (bookStatus) {
                        return str = '已预约'
                    } else {
                        return str = '立即预约'
                    }
                } else {
                    if (availableCount == 0 || spuOrderStatus == 1) {
                        return str = '已售罄'
                    }
                    return str = '立即抢购'
                }
            }

        }
    }

}
</script>

<style lang="scss">
@import '../../styles/tiangong/commen.scss';
@import '../../styles/tiangong/detail.scss';
</style>
