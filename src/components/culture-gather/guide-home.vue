<template>
<div class="guideHome-state-marked" ref="guideHome" @touchmove.prevent="move($event)" @touchstart.prevent="down($event)" @touchend.prevent="end($event)">
    <img class="guide-img-menu" src="https://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/2022101714/floatMenu.png" alt="">
    <img @touchstart.stop="addGuide($event,1)" @touchend.stop="(false)" :class="['guide-img-home',{'isShowIcon':isShowIcon,'guide-img-left':addClassStats==1,'guide-img-right':addClassStats==2}]" src="https://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/2022101714/floatHome.png" alt="">
    <img @touchstart.stop="addGuide($event,2)" @touchend.stop="(false)" :class="['guide-img-user',{'isShowIcon':isShowIcon,'guide-img-left':addClassStats==1,'guide-img-right':addClassStats==2}]" src="https://culturecloud.oss-cn-hangzhou.aliyuncs.com/sh/2022101714/floatUser.png" alt="">
</div>
</template>

<script>
export default {
    name: 'guideHome',
    data() {
        return {
            flags: false,
            position: {
                x: 0,
                y: 0
            },
            nx: '',
            ny: '',
            maxW: '',
            maxH: '',
            initLeftRight: 20,
            isShowIcon: false,
            addClassStats: 0,
            guideTime: 0,
            guideStats: false,
            oldX: '',
            oldY: '',

        }
    },
    methods: {
        addGuide(event, val) {
            event.preventDefault()
            let obj = {
                1: 'cultureGatherIndex',
                2: 'cultureUserCenter'
            }
             this.isShowIcon = false;
            this.$router.push({
                name: obj[val]
            });
        },
        onNext() { // 点击事件
            this.flags = false
        },
        // 实现移动端拖拽
        down(event) {
            this.guideTime = new Date().getTime();
            event.preventDefault()
            this.flags = false;
            this.isShowIcon = !this.isShowIcon;
            const dragDiv = this.$refs.guideHome
            let touch
            if (event.touches) {
                touch = event.touches[0]
            } else {
                touch = event
            }
            // 光标起始位置  touch.clientX/touch.clientY;
            // 左偏移量 offsetLeft   上偏移量 offsetTop
            this.position.x = touch.clientX - dragDiv.offsetLeft
            this.position.y = touch.clientY - dragDiv.offsetTop
            this.oldX = touch.clientX

        },
        move(event) {
             event.preventDefault();
            let touch;
            if (event.touches) {
                touch = event.touches[0];
            } else {
                touch = event;
            }
            if (new Date().getTime() - this.guideTime < 100 || this.oldX===touch.clientX) {
                return this.guideStats = true;
            }
            this.flags = true;
            const dragDiv = this.$refs.guideHome;
            if (this.flags) {
                this.isShowIcon = false;
                // 添加限制：只允许在屏幕内拖动
                // 页面宽高度减去悬浮框宽高
                // offsetWidth和offsetHeight对象自身的的宽度/高度
                this.maxW = document.documentElement.clientWidth - dragDiv.offsetWidth-20;
                // 页面高度
                this.maxH = document.documentElement.clientHeight - dragDiv.offsetHeight-20;
                // 根据初始touch位置计算移动距离:元素移动位置=元素初始位置+(光标移动后的位置-光标点击时的初始位置)
                this.nx = touch.clientX - this.position.x;
                this.ny = touch.clientY - this.position.y;
                if (this.nx <= 0) {
                    this.nx = this.initLeftRight
                } else if (this.nx > this.maxW) {
                    this.nx = this.maxW;
                }
                if (this.ny <= 70) {
                    this.ny = this.initLeftRight + this.commonHeaderHeight
                } else if (this.ny >= this.maxH) {
                    this.ny = this.maxH
                }
                dragDiv.style.left = this.nx + 'px'
                dragDiv.style.top = this.ny + 'px'
            }

        },
        //鼠标释放时候的函数
        end(event) {
            event.preventDefault();
            this.commonHeaderHeight =70;
            const dragDiv = this.$refs.guideHome
            const divH = this.maxH - dragDiv.offsetHeight
            const halfMaxWidth = (this.maxW - dragDiv.offsetWidth) / 2;
            if (this.guideStats) {
                this.maxW = document.documentElement.clientWidth - dragDiv.offsetWidth - 20;
                // 页面高度
                this.maxH = document.documentElement.clientHeight - dragDiv.offsetHeight-20;
                this.guideStats = false;
            }
            // 吸边处理
            if (!this.flags) {
                this.onNext();
                return false;
            }
            //debugger
            if (this.nx > halfMaxWidth) {
                // 右吸边
                dragDiv.style.left = this.maxW + 'px' // 20 = initLeftRight
                this.addClassStats = 2;
            } else {
                // 左吸边
                this.addClassStats = 1;
                dragDiv.style.left = this.initLeftRight + 'px'//20
            }
            // 上吸边 盒子高度顶部距离 < header
            if (dragDiv.offsetTop < this.commonHeaderHeight) {
                dragDiv.style.top = this.commonHeaderHeight + 'px'
            } else if (this.ny >= divH) { // 下吸边
                dragDiv.style.top = this.maxH + 'px'
            }
            this.flags = false;
        },

    }
}
</script>

<style lang="scss" scoped>
.guideHome-state-marked {
    position: fixed;
    bottom: 180px;
    right: 20px;
    z-index: 997;
    color: #f00;
    background: transparent;
    font-size: 16px;
    width: 88px;
    height: 88px;

    img {
        pointer-events: none;

        &.guide-img-menu {
            width: 88px;
            height: 88px;
        }

        &.guide-img-home {
            width: 72px;
            height: 72px;
            opacity: 0;
            transform: translate(6px, -80px);
            transition: 0.3s transform,0.3s opacity;

            &.isShowIcon {
                opacity: 1;
                transform: translate(-50px, -160px);
                pointer-events: all;

                &.guide-img-left {
                    transform: translate(50px, -160px);
                }

                &.guide-img-right {
                    transform: translate(-50px, -160px);

                }
            }
        }

        &.guide-img-user {
            width: 72px;
            height: 72px;
            opacity: 0;
            transform: translate(6px, -160px);
            transition: 0.3s transform,0.3s opacity;

            &.isShowIcon {
                opacity: 1;
                transform: translate(-100px, -150px);
                pointer-events: all;

                &.guide-img-left {
                    transform: translate(100px, -150px);
                }

                &.guide-img-right {
                    transform: translate(-90px, -150px);

                }
            }
        }
    }
}
</style>
