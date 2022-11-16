<template>
<div id="app">
    <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <!-- <transition name="slide-fade" mode='out-in'> -->
    <router-view v-if="keepAlive" />
    <!-- </transition> -->
    <guideHome v-show="showGuide"></guideHome>

</div>
</template>

<script>
import guideHome from '@/components/culture-gather/guide-home';
import {
    mapActions,
    mapMutations,
    mapState,
    mapGetters
} from 'vuex';
export default {
    name: 'App',
    components: {
        guideHome
    },
    provide() {
        return {
            reload: this.reload
        }
    },
    computed: {
        // doneTodosCount(){
        //     return this.$store.getters.doneTodosCount
        // },
        // ...mapGetters(['doneTodosCount']),
        ...mapGetters({doneCount:'doneTodosCount'}),
        // ...mapState('app',['num']),//方便获取多个状态
        ...mapState({
            countPlusLocalState(state) {
                console.log(state)
                return state.app.num + 10
            }
        }),
        showGuide() {
            const names = ['cultureGatherIndex', 'cultureUserCenter', 'cultureFullScreen', 'cultureGatherDetail', 'demo'];
            return this.$route.name && !names.includes(this.$route.name)
        }
    },
    data() {
        return {
            keepAlive: true
        }
    },
    created() {
        // this.$store.commit('setNum');//mutations 等同于下面
        // this.setNum()
        // this.$store.dispatch('                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     ',20);//异步actions 等同于下面
        // this.incrementAsync(20)
        console.log(this.countPlusLocalState, 'store', this.$store.getters.money(3), this.doneCount)
        window.sessionStorage.setItem('ip', returnCitySN["cip"])
    },
    methods: {
        //  ...mapMutations(['setNum']),
        //  ...mapActions(['incrementAsync']),
        reload() {
            console.log("asdd");
            this.keepAlive = false;
            this.$nextTick(() => {
                this.keepAlive = true;
            });
        }
    },
};
</script>

<style>
body,
html {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    /* font-family: 'Microsoft YaHei'; */
    font-family: '-apple-system,sans-serif';
    line-height: unset !important;
    letter-spacing: unset !important;
}

#app {
    width: 100%;
    height: 100%;
    font-family: '-apple-system,sans-serif';
    line-height: unset;
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-to {
    transition: 0.5s all 0.1s ease;
    /* animation: fade 0.6s ease 0.6s; */
}

.slide-fade-leave {
    opacity: 1;
    /* transform: translate3d(10%, 0, 0); */
}

.slide-fade-enter {
    transform: translate3d(100%, 0, 0);
}

.slide-fade-leave-to {
    opacity: 0;
    transition: all 0.1s ease;
}

#marmosetUI>div:last-of-type div input {
    display: none;
}

#marmosetUI text {
    display: none;
}

#marmosetUI div:nth-last-of-type(3) {
    display: none;
}
</style>
