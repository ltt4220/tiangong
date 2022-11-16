<template>
<div>
    <video v-if="options.sources[0] && options.sources[0].src" id="example_video_1" ref="videoPlayer" class="video-js" x5-video-player-type="h5" webkit-playsinline="true" playsinline="true"></video>
</div>
</template>

<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
export default {
    name: "VideoPlayer",
    props: {
        options: {
            type: Object,
            default () {
                return {};
            }
        },
        isPause: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {
            player: null,
        }
    },
    created() {
        this.$nextTick(() => {
            this.initVideo();
        });
    },
    methods: {
        initVideo() {
            this.player = videojs(this.$refs.videoPlayer, this.options, function () {
                const button = document.querySelector(`.vjs-big-play-button`);
                if (typeof WeixinJSBridge !== 'undefined') {
                    WeixinJSBridge.invoke('getNetworkType', {}, (e) => {
                        this.play().then(_ => {}).catch(err => {
                            console.log(err,'ddddddddd')
                        });
                    }, false);
                } else {
                    this.play().then(_ => {}).catch(err => {
                        console.log(err, 222)
                    });
                }
                this.on('pause', () => {
                    button.style.display = 'block';
                })
                this.on('play', () => {
                    button.style.display = 'none';
                })
                this.on('seeking', () => { //寻找中
                    button.style.display = 'none';
                    this.play();
                });
            })

            const track = document.querySelector('.vjs-text-track-display');
            const btn = document.querySelector('.vjs-big-play-button');
            track.addEventListener('click', (event) => {
                event.preventDefault();
                if (this.$refs.videoPlayer.paused || this.$refs.videoPlayer.paused === undefined) {
                    this.$refs.videoPlayer.play();
                    btn.style.display = 'none';
                } else if (this.isPause) {
                    btn.style.display = 'block';
                    this.$refs.videoPlayer.pause();
                }
            }, false)
        },
    },
    beforeDestroy() {
        if (this.player) {
            this.player.dispose()
        }
    }
}
</script>

<style lang="scss">
.video-js {
    width: 100%;

    .vjs-text-track-display {
        pointer-events: all;

        &.vjs-hidden {
            // display: block !important;
        }
    }

    .vjs-poster {
        background-size: cover;
    }

    .vjs-big-play-button {
        width: 88px;
        height: 88px;
        background: transparent url(../../assets/images/tiangong/bigPlay.png) no-repeat !important;
        border: none;
        outline: none;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        // display: block;
        span {
            display: none;
        }
    }

    .vjs-control-bar {
        background: transparent;
        align-items: center;
        width: 100%;
        justify-content: space-between;
        height: 84px;

        .vjs-play-control,
        .vjs-fullscreen-control {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 54px;
            flex: 0 0 78px;
            // line-height: 84px;
        }

        .vjs-icon-placeholder::before {
            font-size: inherit;
            position: relative;
            // top: -10px;
        }

        .vjs-volume-panel,
        .vjs-picture-in-picture-control {
            display: none;
        }

        .vjs-current-time,
        .vjs-remaining-time {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            padding-left: 28px;
            padding-right: 28px;
            flex: 0 0 80px;
        }

        .vjs-fullscreen-control {
            font-size: 64px;
            background: url(../../assets/images/tiangong/screen.png) no-repeat center;
            background-size: 40px 42px;

            span {
                display: none;
            }
        }

        .vjs-progress-control {
            min-width: 8em;

            .vjs-progress-holder {
                height: 5px;

                //   flex: 0 0 370px;
                .vjs-play-progress:before {
                    font-size: 30px;
                    top: -12px;
                }
            }
        }
    }
}
</style>
