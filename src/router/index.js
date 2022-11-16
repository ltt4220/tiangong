// 路由配置
import Vue from 'vue';
import Router from 'vue-router';
const folderName = 'tiangong'//culture-gather
import { handleEenterPv, handleLeavePv } from "../utils/pv";

Vue.use(Router);
/**
 * 路由配置：｛
 *  public：true 可外部分享访问
 *  title: '' 设置页面title
 *  keepAlive：true 开启keepAlive模式
 * ｝
 */
export const constantRouterMap = [
  {
    path: `/:shopPath/${folderName}/mysteryBox`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/mysteryBox`),
    name: 'mysteryBox',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/messageList`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/messageList`),
    name: 'messageList',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/rewardRules`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/rewardRules`),
    name: 'rewardRules',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/invitedRecord`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/invitedRecord`),
    name: 'invitedRecord',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/inviteFriends`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/inviteFriends`),
    name: 'inviteFriends',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/checkWord`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/checkWord`),
    name: 'checkWord',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/bazaar`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/bazaar`),
    name: 'bazaar',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false,
    }
  },
  {
    path: `/:shopPath/${folderName}/receiveConfirmExamples`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/receiveConfirmExamples`),
    name: 'receiveConfirmExamples',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/receiveExamples`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/receiveExamples`),
    name: 'receiveExamples',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/settingPass`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/settingPass`),
    name: 'settingPass',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/loadingConfirmExamples`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/loadingConfirmExamples`),
    name: 'loadingConfirmExamples',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/confirmExamples`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/confirmExamples`),
    name: 'confirmExamples',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/searchExamples`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/searchExamples`),
    name: 'searchExamples',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/qrCodeIndex`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/qrCodeIndex`),
    name: 'qrCodeIndex',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false,
    }
  },
  {
    path: `/:shopPath/${folderName}/demo`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/demo`),
    name: 'demo',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false
    }
  },
  {
    path: `/:shopPath/${folderName}/understand`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/understand`),
    name: 'cultureUnderstand',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false
    }
  },
  {
    path: `/:shopPath/${folderName}/tweets`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/tweets`),
    name: 'cultureTweets',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false
    }
  },
  {
    path: `/:shopPath/${folderName}/tweetsVideo`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/tweetsVideo`),
    name: 'cultureTweetsVideo',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false
    }
  },
  {
    path: `/:shopPath/${folderName}/popularization`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/popularization`),
    name: 'culturePopularization',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false
    }
  },
  {
    path: `/:shopPath/${folderName}/fullScreen3D`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/fullScreen3D`),
    name: 'cultureFullScreen',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false
    }
  },
  {
    path: `/:shopPath/${folderName}/privacyAgreement`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/privacyAgreement`),
    name: 'privacyAgreement',
    meta: {
      public: true,
      title: '隐私政策',
      keepAlive: false
    }
  },
  {
    path: `/:shopPath/${folderName}/userAgreement`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/userAgreement`),
    name: 'userAgreement',
    meta: {
      public: true,
      title: '用户协议',
      keepAlive: false
    }
  },
  {
    path: `/:shopPath/${folderName}/aboutUs`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/aboutUs`),
    name: 'cultureAboutUs',
    meta: {
      public: true,
      title: '关于我们',
      keepAlive: false
    }
  },
  {
    path: `/:shopPath/${folderName}/defaultPage`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/defaultPage`),
    name: 'defaultPage',
    meta: {
      public: true,
      title: '网页异常',
      keepAlive: false
    }
  },
  {
    path: `/:shopPath/${folderName}/index`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/index`),
    name: 'cultureGatherIndex',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false
    }
  },
  {
    path: `/:shopPath/${folderName}/login`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/login`),
    name: 'cultureGatherLogin',
    meta: {
      public: true,
      title: '天工严选登录',
      keepAlive: false
    },
  },
  {
    path: `/:shopPath/${folderName}/overseasLogin`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/overseasLogin`),
    name: 'overseasLogin',
    meta: {
      public: true,
      title: '天工严选登录',
      keepAlive: false
    },
  },
  {
    path: `/:shopPath/${folderName}/members`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/members`),
    name: 'cultureMembers',
    meta: {
      public: true,
      title: '天工严选登录',
      keepAlive: false
    },
  },
  {
    path: `/:shopPath/${folderName}/detail`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/detail`),
    name: 'cultureGatherDetail',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false
    }
  },
  {
    path: `/:shopPath/${folderName}/submitOrder`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/submitOrder`),
    name: 'cultureSubmitBox',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/commentsList`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/commentsList`),
    name: 'cultureComments',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false
    }
  },
  {
    path: `/:shopPath/${folderName}/addComment`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/addComment`),
    name: 'cultureAddComment',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/subscribe`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/subscribe`),
    name: 'cultureSubscribe',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false,
      needUserInfo: true
    }
  }, {
    path: `/:shopPath/${folderName}/creatBlockChain`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/creatBlockChain`),
    name: 'creatBlockChain',
    meta: {
      public: true,
      title: '天工严选实名认证',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/checkUserInfo`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/checkUserInfo`),
    name: 'checkUserInfo',
    meta: {
      public: true,
      title: '天工严选',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/order`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/order`),
    name: 'cultureOrder',
    meta: {
      public: true,
      title: '天工严选订单',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/certificateDetail`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/certificateDetail`),
    name: 'cultureCertificateDetail',
    meta: {
      public: true,
      title: '天工严选证书',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/mycollectionDetail`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/mycollectionDetail`),
    name: 'cultureMycollectionDetail',
    meta: {
      public: true,
      title: '天工严选我的藏品',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/orderDetail`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/orderDetail`),
    name: 'cultureDetail',

    meta: {
      public: true,
      title: '天工严选订单',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/usercenter`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/usercenter`),
    name: 'cultureUserCenter',
    meta: {
      public: true,
      title: '个人中心',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/setting`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/setting`),
    name: 'cultureSetting',
    meta: {
      public: true,
      title: '设置',
      keepAlive: false,
      needUserInfo: false
    }
  },
  {
    path: `/:shopPath/${folderName}/feedback`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/feedback`),
    name: 'cultureFeedback',
    meta: {
      public: true,
      title: '我要反馈',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/historyOrder`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/historyOrder`),
    name: 'cultureHistoryOrder',
    meta: {
      public: true,
      title: '历史记录',
      keepAlive: false,
      needUserInfo: true
    }
  },
  {
    path: `/:shopPath/${folderName}/personalDetail`,
    component: () => import(/* @vite-ignore */`../views/${folderName}/personalDetail`),
    name: 'culturePersonalDetail',
    meta: {
      public: true,
      title: '个人资料',
      keepAlive: false,
      needUserInfo: true
    }
  },
  // 用于服务器匹配不到路由的情况
  {
    path: '*',
    redirect: '/home',
    name: 'Home'
  }
];

let history;
// 生产环境使用history
if (window.location.hostname.includes('wenhuayun')) {
  history = 'history';
} else {
  history = '';
}

const router = new Router({
  mode: history, // 后端支持可开
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition && to.meta.keepAlive) {
      return savedPosition;
    } else {
      return {
        x: 0,
        y: 0
      };
    }
  },
  routes: constantRouterMap
});
// 路由拦截器
router.beforeEach((to, from, next) => {
  // 根据路由中的title设置页面title
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  let token = window.localStorage.getItem('jwtToken') || '';
  if (!token && to.meta.needUserInfo) {
    // if (typeof window.whySDK == 'object' && typeof whySDK.userLogin == 'function') {
    //   whySDK.userLogin();
    // } else {
    //   next({ path: `/${to.params.shopPath}/${folderName}/login`, query: { ...to.query, name: to.name } })
    // }
    next({ path: `/${to.params.shopPath}/${folderName}/login`, query: { ...to.query, name: to.name } })
  }
  // if (to.name == "cultureGatherIndex" || to.name == "cultureGatherDetail") {
  //   to.meta.keepAlive = false;
  // }
  next();
});
router.afterEach((to, form) => {
  let info = localStorage.getItem('pvInfo') || '{}';
  const _pvInfo = JSON.parse(info) || {};
  if (_pvInfo && _pvInfo.fullPath !== form.fullPath) {
    handleLeavePv(Vue, to)
  } else {
    handleEenterPv(Vue, to)
  }
})
export default router;
