/*
 * @Description : 全局方法
 * @Author: zxh
 * @Date: 2022-04-24 21:03:10
 * @LastEditors: zxh
 * @LastEditTime: 2022-06-09 17:50:35
 * @FilePath: \ct_client\ct-client\src\utils\auth.js
 * @Url:
 */
// import Cookies from 'js-cookie';
const { serveConfig } = require('./config.serve');
/**
 * @description: 跳转登录，成功后重定向
 * @param String
 * @return:
 */
export function login(shopPath) {
  location.href =
    '/' +
    shopPath +
    '/login?type=' +
    encodeURIComponent(
      (shopPath === 'sh' ? serveConfig.ssApi : serveConfig.basePath) +
      '/' +
      shopPath +
      '/setSession.html?url=' +
      encodeURIComponent(location.href)
    );
}

/**
 * @description: 跳转到node环境，带token
 * @param String
 * @return:
 */
export function locationHref(url, token) {
  // const encStr = `{"timeStamp":${new Date().getTime()},"token":"${jwtStr}"}`;
  location.href = `${url}&token=${token}&userId=${localStorage.getItem('userId')}`;
  // (shopPath === 'sh' ? serveConfig.ssApi : serveConfig.basePath) +
  //   '/' +
  //   shopPath +
  //   '/setSession.html?url=' +
  //   encodeURIComponent(url) +
  //   '&token=' +
  //   encrypt.Encrypt(encStr) +
  //   '&userId=' +
  //   localStorage.getItem('userId');
}

/**
 * @description: 获取路由地址参数
 * @param String
 * @return:
 */
export function qs(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}

// export function setInfo(info) {
//   const inFifteenMinutes = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
//   return Cookies.set(userInfo, info, {
//     expires: inFifteenMinutes
//   });
// }
