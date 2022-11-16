<template>
<div class="public-pop-box" v-if="ispopshow">
    <div class="pubilic-content">
        <div class="colse-headerbtn" @click="addCanle">
            <i class="iconfont icon-close"></i>
        </div>
        <div class="head-box">
            <i v-show="isIcon" :class="['pubilic-content-img iconfont',{'icon-guanyuwomen':!titlepic,'icon-duigouxuanzhong':titlepic}]"></i>
            <h3>{{titlename}}</h3>
        </div>
        <div class="cont-box" v-html="content" :style="{textAlign:comipteTit=='邀请好友注册'?'justify':'center'}"></div>
        <div class="foot-box">
            <button class="canle" v-if="iscanle" @click="addCanle">{{canleTit}}</button>
            <button class="comipte" @click="addComipte">{{comipteTit}}</button>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'public-pop-box',
    props: {
        ispopshow: {
            type: Boolean,
            default: false,
        },
        //标题名称
        titlename: {
            type: String,
            default: '温馨提示'
        },
        //标题图像
        titlepic: {
            type: Boolean,
            default: false
        },
        content: {
            type: String,
            default: ''
        },
        iscanle: {
            type: Boolean,
            default: false,
        },
        iscallback: {
            type: Function,
            default: () => {},
        },
        isIcon: {
            type: Boolean,
            default: true,
        },
        canleTit: {
            type: String,
            default: '取消'
        },
        comipteTit: {
            type: String,
            default: '确定'
        },
        canleBackType: {
            type: Number,
            default: 0,
        }
    },
    data() {
        return {
            userId: ''
        }
    },
    mounted() {

    },
    methods: {
        addComipte() {
            this.$emit('callback', this.iscallback)
        },
        addCanle(val) {
            if (this.canleBackType) {
                let obj = {
                    1: () => {
                        this.$router.go(-1);
                        this.$emit('callback', false);
                    }
                }
                obj[this.canleBackType]();
            } else {
                this.$emit('callback', false)
            }

        },
    }
}
</script>
