<template>
<div class="mysteryBox">
    <div class="container">
        <div class="dot"></div>
        <div class="pulse"></div>
        <div class="pulse1"></div>
    </div>
</div>
</template>

<script>
export default {
    name: 'mysteryBox'
}
</script>

<style lang="scss" scoped>
* {
    padding: 0;
    margin: 0;
}

@keyframes warn {
    0% {
        transform: scale(0.3);
        -webkit-transform: scale(0.3);
        opacity: 0.0;
    }

    25% {
        transform: scale(0.3);
        -webkit-transform: scale(0.3);
        opacity: 0.1;
    }

    50% {
        transform: scale(0.5);
        -webkit-transform: scale(0.5);
        opacity: 0.3;
    }

    75% {
        transform: scale(0.8);
        -webkit-transform: scale(0.8);
        opacity: 0.5;
    }

    100% {
        transform: scale(1);
        -webkit-transform: scale(1);
        opacity: 0.0;
    }
}

@keyframes warn1 {
    0% {
        transform: scale(0.3);
        -webkit-transform: scale(0.3);
        opacity: 0.0;
    }

    25% {
        transform: scale(0.3);
        -webkit-transform: scale(0.3);
        opacity: 0.1;
    }

    50% {
        transform: scale(0.3);
        -webkit-transform: scale(0.3);
        opacity: 0.3;
    }

    75% {
        transform: scale(0.5);
        -webkit-transform: scale(0.5);
        opacity: 0.5;
    }

    100% {
        transform: scale(0.8);
        -webkit-transform: scale(0.8);
        opacity: 0.0;
    }
}

.container {
    position: relative;
    width: 40px;
    height: 40px;
    /*border: 1px solid #000; hovertree.com */
}

/* 保持大小不变的小圆圈 */
.dot {
    position: absolute;
    width: 92px;
    height: 92px;
    left: 120px;
    top: 120px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border: 2px solid red;
    border-radius: 50%;
    z-index: 2;
}

/* 产生动画（向外扩散变大）的圆圈  */
.pulse {
    position: absolute;
    width: 320px;
    height: 320px;
    left: 2px;
    top: 2px;
    border: 6px solid red;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    z-index: 1;
    opacity: 0;
    -webkit-animation: warn 2s ease-out;
    -moz-animation: warn 2s ease-out;
    animation: warn 2s ease-out;
    -webkit-animation-iteration-count: infinite;
    -moz-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    box-shadow: 1px 1px 30px red;
}

.pulse1 {
    position: absolute;
    width: 320px;
    height: 320px;
    left: 2px;
    top: 2px;
    border: 6px solid red;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    z-index: 1;
    opacity: 0;
    -webkit-animation: warn1 2s ease-out;
    -moz-animation: warn1 2s ease-out;
    animation: warn1 2s ease-out;
    -webkit-animation-iteration-count: infinite;
    -moz-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    box-shadow: 1px 1px 30px red;
}

a {
    color: blue;
    text-decoration: none;
}

.mysteryBox {
    span {
        width: 200px;
        height: 200px;
        display: flex;
        box-sizing: border-box;
        background: #0f0;
        opacity: 0;

        &.animate__zoomInUp {
            animation: zoomInUp 1s 0s both;
        }
    }

    @keyframes zoomInUp {
        0% {
            animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
            opacity: 0;
            transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0);
        }

        60% {
            animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
            opacity: 1;
            transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);
        }

        100% {
            opacity: 1;
        }
    }
}
</style>
