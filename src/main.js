import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import infiniteScroll from 'vue-infinite-scroll';
import infoCooOss from './utils/oss'; // 引入阿里上传
const { serveConfig } = require('./utils/config.serve');
import './plugins/index.js';
import 'cube-ui/lib/style.css';
import {
  Lazyload 
} from 'vant';
Vue.use(infoCooOss);
Vue.use(infiniteScroll);

// 注册时可以配置额外的选项
Vue.use(Lazyload, {
  lazyComponent: true,
});
Vue.config.productionTip = false;
serveConfig.baseShopPath = window.location.hostname + (window.location.port ? (":" + window.location.port + "/#") : '');
Vue.prototype.$config = serveConfig;
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
