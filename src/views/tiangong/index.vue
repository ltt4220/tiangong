<template>
  <div class="culture-home-box" v-if="modalShow" v-lazy:background-image="imgObj.indexbg">
    <div class="culture-logo-box">
      <img src="../../assets/images/tiangong/logo.png" alt="logo" class="culture-logo">
      <span>
        <i class="iconfont icon-kefu" @click.stop="subWechatKefuCallBack"></i>
        <i :class="['iconfont icon-31xiaoxi',{'active':true}]" @click="goLink"></i>
      </span>

      <!-- 天工数藏 -->
    </div>
    <div class="swiper-box-culture">
      <div class="swiper culture-swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" :data-adverturl="item.advertUrl" v-for="(item,i) in bannerList" :key="i">
            <img :src="item.advertImgUrl" alt="">
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </div>
    <Tabs v-model="activeTitle" sticky animated swipeable :line-width="0" ref="tabs">
      <Tab v-for="(nav,n) in tabsNav" :key="n" :title="nav.name">
        <template v-if="nav.name == '数字藏品'">
          <List v-model="isLoading" :finished="finished" @load="getList">
            <div class="cultureHome-list-contents" v-if="isListBool==1">
              <div class="cultureHome-list-item" v-for="(item,index) in dataList" :key="index" @click="goDetail(item.spuId)">
                <img v-lazy="item.spuImages" :key="item.spuImages" class="cultureHome-list-item-backgroundUrl">
                <div class="list-item-tag" v-if="item.spuOrderStatus != 3" v-html="handleStatus(item)"></div>
                <div class="list-item-tag" v-if="item.spuOrderStatus == 3">
                  <i class="list-item-saleImg iconfont icon-shizhong"></i>即将开售
                  <CountDown :time="item.countDown" @finish="addfinish(item)" />
                </div>
                <div class="list-info-box">
                  <div class="list-item-info">
                    <div class="info-title">{{item.spuSubtitle}}{{item.spuName}}</div>
                    <div class="info-label">
                      <div class="info-label-left">
                        <span class="info-label-left-icon">
                          <img src="../../assets/images/culture-gather/limit2.png" alt="" class="info-label-left-img">
                        </span>
                        <span>{{setAvailableCount(item)}}份</span>
                      </div>
                      <div class="info-label-right" v-if="item.classificationName">{{item.classificationName}}
                      </div>
                    </div>
                    <div class="info-ticket">
                      <div class="info-ticket-user">
                        <img :src="item.creatorImgUrl || imgObj.userPic" alt="" class="info-user-image">
                        <span>{{item.creatorName}}</span>
                      </div>
                      <div class="price_count_box" v-html="getPrice(item)"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mycollection-noList" v-else-if="isListBool==2"><i class="iconfont icon-queshengye-cangpin"></i> 暂无数字藏品</div>
          </List>
        </template>
        <template v-if="nav.name == '内容精选'">
          <List v-model="query.isLoading" :finished="query.finished" @load="loadInfoList">
            <ul class="content-select-box" v-if="query.isListBool==1">
              <li v-for="(el,e) in newsList" :key="e" @click="goDetail(el.infoId,el.infoType)">
                <img v-lazy="el.infoCoverUrl" :key="el.infoCoverUrl" alt="">
                <div class="info-box">
                  <h3>{{el.infoTitle}}</h3>
                  <p>{{el.infoIntroduction}}</p>
                  <div class="info-ticket">
                    <span>{{setTime(el.updateTime,'yyyy-mm-dd','.')}}</span>
                    <span><i class="iconfont icon-yanjing"></i> {{el.browseCount}}</span>
                  </div>
                </div>
              </li>
            </ul>
            <div class="mycollection-noList" v-else-if="query.isListBool==2"><i class="iconfont icon-queshengye-cangpin"></i> 暂无内容精选</div>
          </List>
        </template>
      </Tab>
    </Tabs>
    <publicFooter :active="'home'"></publicFooter>
  </div>
</template>
<script>
import Swiper from 'swiper';
import 'swiper/css/swiper.min.css';
import publicFooter from '@/components/culture-gather/footer-common';
import {
    List,
    CountDown,
    Tabs,
    Tab
} from 'vant';
import {
    bannerList,
    spuList,
    infoList
} from '@/assets/api/gateway';
import {
    WeChat
} from '@/plugins/mixin';
import encrypt from "@/utils/encrypt.js"
import indexbg from '../../assets/images/tiangong/indexBg.png';
import userPic from '../../assets/images/culture-gather/user-pic.png';
export default {
    name: 'cultureGatherIndex',
    components: {
        publicFooter,
        Swiper,
        List,
        CountDown,
        Tabs,
        Tab
    },
    mixins: [WeChat],
    data() {
        return {
            dataList: [],
            // 是否滚动到底部
            isEnd: false,
            filterParams: {
                page: 1,
                rows: 10,
                shopPath: this.$route.params.shopPath,
            },
            isLoading: false,
            finished: false,
            curTime: '',
            bannerList: [],
            imgObj: {
                indexbg,
                userPic
            },
            availableCount: '',
            isListBool: false,
            isSticky: false,
            workLink: 'https://work.weixin.qq.com/kfid/kfc7625783dcdee8167',
            query: {
                page: 1,
                rows: 10,
                isLoading: false,
                finished: false,
                isListBool: false
            },
            newsList: [],
            activeTitle: '数字藏品',
            tabsNav: [{
                name: '数字藏品'
            }, {
                name: '内容精选'
            }],
            modalShow: false,
        }
    },
    created() {
        this.getBanner();
        // this.subUserInfoCallBack();
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
    },
    beforeRouteEnter(to, from, next) {
        if (typeof window.whySDK == 'object' && typeof whySDK.scrollPage == 'function') {
            whySDK.scrollPage();
        }
        next();

    },
    mounted() {
        this.publicShare({
            shareTitle: '天工严选数藏',
            shareImgUrl: 'https://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/sh/sh/H5/20220814214102aZDUfVhz0NQQ2dDfDDk9.png',
            shareDesc: '“天工严选”数字藏品依托文化云，致力打造全球领先的数字藏品综合服务平台。'
        })
        this.modalShow = false;
        this.$nextTick(() => {
            this.modalShow = true;
            this.$forceUpdate();
        })
    },
    methods: {
        goLink(){
            this.$router.push({name:'messageList'});
        },
        subWechatKefuCallBack() {
            if (typeof window.whySDK == 'object' && typeof whySDK.wechatKefu == 'function') {
                var data = {
                    "corporateId": "ww2efa250da5dabd58",
                    "kfUrl": "https://work.weixin.qq.com/kfid/kfc7625783dcdee8167"
                };
                whySDK.wechatKefu(JSON.stringify(data));
            } else {
                window.location.href = this.workLink;
            }
        },
        subUserInfoCallBack() {
            if (typeof window.whySDK == 'object' && typeof whySDK.getUserInfo == 'function') {
                whySDK.getUserInfo();
            }
        },
        getUserInfo(user) {
            localStorage.setItem('jwtToken', user.jwtStr || '');
            localStorage.setItem('userType', user.userType || '');
        },
        setTime(time, format, type) {
            return encrypt.transformation(time, format, type)
        },
        loadInfoList() {
            let query = {
                page: this.query.page,
                rows: this.query.rows,
                shopPath: this.$route.params.shopPath,
            }
            infoList(query).then(res => {
                if (res.status != 200) {
                    this.query.isListBool = 2;
                    return this.query.finished = true
                }
                let data = res.data || [];
                if (!data.length && !this.newsList.length) {
                    this.query.isListBool = 2;
                    this.query.isLoading = false;
                    this.query.finished = true;
                } else {
                    this.query.isListBool = 1;
                    this.push(data, 'newsList');
                    if (data.length == this.query.rows) {
                        this.query.isLoading = true;
                        this.query.page += 1
                        this.query.finished = false;
                        this.loadInfoList();
                    } else {
                        this.query.isLoading = false;
                        this.query.finished = true;
                    }

                }
            })
        },
        addfinish(el) {
            el.spuOrderStatus = 4;
        },
        setAvailableCount(item) {
             return '限量' + item.spuStock;
            // if (item.spuOrderStatus == 2 || item.spuOrderStatus == 3) {
            //     return '限量' + item.spuStock;
            // } else {
            //     return '库存' + item.availableCount;
            // }
        },
        setCTime(item) {
            let curTime = this.setFormTime(this.curTime)
            let spuStartTime = this.setFormTime(item.spuStartTime)
            let supEndTime = this.setFormTime(item.spuEndTime)
            return {
                curTime,
                spuStartTime,
                supEndTime
            };
        },
        setFormTime(time) {
            if (String(time).indexOf('-') > -1) {
                time = time.replace(/\-/gi, '/');
            }
            return Date.parse(new Date(time))
        },
        // 处理状态
        handleStatus(item) {
            let obj = {
                1: `<i class="list-item-saleImg iconfont icon-reduce"></i>已售罄`,
                2: `<i class="list-item-saleImg iconfont icon-shizhong"></i>敬情期待 ${encrypt.transformation(item.spuStartTime)} 开售`,
                3: "即将开售",
                4: `<i class="list-item-orderImg iconfont icon-huo"></i>正在抢购`
            }
            return obj[item.spuOrderStatus]
        },
        addLink(el) {
            window.location.href = el;
        },
        getBanner() {
            let query = {
                shopPath: this.$route.params.shopPath,
            };
            bannerList(query).then(res => {
                let data = res.data || [];
                this.bannerList = data;
                let that = this;
                this.$nextTick(() => {
                    new Swiper('.culture-swiper', {
                        autoplay: true,
                        loop: true,
                        // slidesPerView: 1.2,
                        centeredSlides: true,
                        spaceBetween: 40,
                        centeredSlides: true,
                        pagination: {
                            el: '.swiper-pagination',
                            bulletElement: 'li',
                            clickable: true,
                        },
                        on: {
                            click: function () {
                                const {
                                    adverturl
                                } = this.clickedSlide.dataset || '';
                                that.addLink(adverturl)
                            }
                        },
                    });
                })
            })
        },
        // spuStock 总量
        goDetail(spuId, attr = 0) {
            let obj = {
                0: 'cultureGatherDetail',
                1: 'cultureTweets',
                2: 'cultureTweetsVideo',
            }
            this.$router.push({
                name: obj[attr],
                query: {
                    id: spuId
                }
            })
        },
        // 获取商品列表
        getList() {
            spuList(this.filterParams).then(res => {
                if (res.status != 200) {
                    this.isListBool = 2;
                    return this.finished = true
                }
                let data = (res.data.list || {}).list || [];
                this.curTime = res.data.currentDate;
                data = data.map(item => {
                    if (item.isMembers) { //vip
                        item.spuOrderStatus = item.spuOrderStatus != 1 ? 4 : 1;
                    } else { //非vip
                        if (item.spuOrderStatus == 3) {
                            let {
                                curTime,
                                spuStartTime,
                            } = this.setCTime(item);
                            let mss = parseInt(spuStartTime) - parseInt(curTime || 0);
                            item.countDown = mss <= 0 ? 0 : mss;
                        }
                    }
                    return item
                })

                if (!data.length && !this.dataList.length) {
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
                        this.getList();
                    } else {
                        this.isLoading = false;
                        this.finished = true;
                    }

                }
            });
        },
        push(arr, attr = 'dataList') {
            this[attr].push.apply(this[attr], arr);
            this.$forceUpdate();
        },
        getPrice({
            spuPayMethod,
            spuOriginalPrice
        }) {
            const payTypeObj = {
                0: '免费',
                1: `<i class="price">￥</i>${spuOriginalPrice ? spuOriginalPrice.toFixed(2) : '0.00'}`
            }
            return payTypeObj[spuPayMethod]
        },
    },
};
</script>

<style lang="scss">
@import '../../styles/tiangong/commen.scss';
@import '../../styles/tiangong/index.scss';
</style>
