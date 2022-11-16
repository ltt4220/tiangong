<template>
<div class="comments-container">
    <div class="comments-box">
        <h3 class="title-box">评论 <span>{{total}}</span></h3>
        <List v-model="isLoading" :finished="finished" @load="addCommentList">
            <ul class="comment-list">
                <li v-for="(item,i) in commentList" :key="i" class="list-item">
                    <img :src="item.userHeadImgUrl || userPic" alt="" class="pic">
                    <!-- <div v-show="!item.userHeadImgUrl" class="pic pic-img" :style="{backgroundColor:item.color}"></div> -->
                    <div class="right-box">
                        <h3 class="info-box">
                            <p>{{item.commentUserNickName}}&emsp;{{getCommentTime(item.commentTime)}}</p><i class="iconfont icon-pinglun2" @click="addLink(item)"></i>
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
        </List>
    </div>
    <div class="input-box" @click="addLink">
        <i class="iconfont icon-xiepinglun1"></i>
        <span>请文明评论</span>
    </div>
</div>
</template>

<script>
import {
    commentList
} from '@/assets/api/gateway';
import {
    List
} from 'vant';
import encrypt from "@/utils/encrypt.js"
import userPic from '../../assets/images/culture-gather/user-pic.png';
export default {
    name: 'cultureComments',
    components: {
        List
    },
    data() {
        return {
            commentList: [],
            query: {
                page: 1,
                rows: 12,
                shopPath: this.$route.params.shopPath,
                commentRkId: this.$route.query.id || '',
            },
            total: 0,
            userPic,
            isLoading: false,
            finished: false,
        }
    },
    created() {
        window.sessionStorage.removeItem('commentInfo');
    },
    methods: {
        setTime(time, format, type) {
            return encrypt.transformation(time, format, type)
        },
        addLink(item = {}) {
            let obj = {
                1: 'cultureComments',
                2: 'cultureAddComment'
            }
            if (item.commentId) {
                window.sessionStorage.setItem('commentInfo', JSON.stringify(item))
            }
            this.$router.push({
                name: 'cultureAddComment',
                query: {
                    id: item.commentId,
                    commentRkId: this.query.commentRkId,
                }
            });
        },
        push(arr) {
            this.commentList.push.apply(this.commentList, arr);
        },
        addCommentList() {
            commentList(this.query).then(res => {
                if (res.status != 200) {
                    return this.finished = true;
                }
                let data = res.data || {};
                let list = data.list || [];
                let color = ['#B99428', '#4A7EE7', '#CD4B68', '#228E7B', '#9D4D32', '#5A8A18', '#918355', '#5E319F']
                list = list.map(el => {
                    let num = Math.floor((Math.random() * 8));
                    console.log(num, 'dsddddddd')
                    el.color = color[num]
                    return el;
                })
                console.log(list, 'list,ddddd');
                this.total = data.count;
                if (!list.length && !this.commentList.length) {
                    this.isLoading = false;
                    this.finished = true;
                } else {
                    this.push(list);
                    if (list.length == this.query.rows || this.commentList.length < this.total) {
                        this.isLoading = true;
                        this.query.page += 1
                        this.finished = false;
                        this.addCommentList();
                    } else {
                        this.finished = true;
                    }

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
    },
}
</script>

<style lang="scss" scoped>
@mixin flex($center, $content) {
    display: flex;
    justify-content: $content;
    align-items: $center;
}

* {
    padding: 0;
    margin: 0;
}

.comments-container {
    padding-bottom: 24px;
    box-sizing: border-box;
    height: 100vh;
    @include flex(flex-start, space-between);
    flex-direction: column;
    background: #000000;
    backdrop-filter: blur(8px);

    .comments-box {
        width: 100%;
        height: calc(100% - 140px);
        overflow: auto;
        background: #222222;
        padding: 52px 44px;
        box-sizing: border-box;

        .title-box {
            font-size: 32px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ffffff;
            position: relative;

            span {
                color: #d8b77b;
            }
        }

        .comment-list {
            margin-top: 14px;

            .list-item {
                width: 100%;
                padding-top: 42px;
                @include flex(flex-start, flex-start);

                .pic {
                    flex: 0 0 72px;
                    height: 72px;
                    border-radius: 50%;
                    width: 72px;

                    &.pic-img {
                        background-image: url(../../assets/images/tiangong/tx.png);
                        background-repeat: no-repeat;
                        background-position: center;
                        background-size: 50%;
                    }
                }

                .right-box {
                    flex: auto;
                    margin-left: 34px;
                    padding-bottom: 24px;
                    border-bottom: 2px solid rgba($color: #fff, $alpha: 0.2);

                    .info-box {
                        font-size: 28px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #cccccc;
                        line-height: 40px;
                        @include flex(flex-start, space-between);

                        p {
                            padding-top: 14px;
                        }

                        i {
                            flex: 0 0 40px;
                            color: #999999;
                            font-size: 40px;
                        }
                    }

                    .info-body {
                        margin-top: 12px;
                        font-size: 30px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #ffffff;
                        line-height: 42px;
                    }

                    .child-comment {
                        padding-bottom: 42px;

                        .child-item {
                            margin-top: 20px;
                            background: rgba($color: #fff, $alpha: 0.08);
                            border-radius: 20px;
                            padding: 16px 20px;
                            box-sizing: border-box;

                            .chiild-right-box {
                                .child-info-box {
                                    font-size: 28px;
                                    font-family: PingFangSC-Regular, PingFang SC;
                                    font-weight: 400;
                                    color: #cccccc;
                                    line-height: 40px;

                                    .child-pic {
                                        margin-right: 10px;
                                        width: 56px;
                                        height: 56px;
                                        border-radius: 50%;
                                    }
                                }

                                .child-info-body {
                                    margin-top: 12px;
                                    font-size: 30px;
                                    font-family: PingFangSC-Regular, PingFang SC;
                                    font-weight: 400;
                                    color: #ffffff;
                                    line-height: 42px;
                                    padding: 0 6px;
                                    box-sizing: border-box;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .input-box {
        padding-left: 90px;
        box-sizing: border-box;
        background: rgba($color: #fff, $alpha: 0.12);
        border-radius: 45px;
        @include flex(center, space-between);
        position: relative;
        height: 80px;
        width: calc(100% - 80px);
        margin: 0 auto 24px;

        span {
            font-size: 30px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            width: 100%;
            height: 100%;
            @include flex(center, flex-start);
        }

        i {
            position: absolute;
            left: 36px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 32px;
            color: #fff;
        }
    }
}
</style>
