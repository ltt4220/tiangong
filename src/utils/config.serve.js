const proServe = {
  shopPath: 'sh',
  apiUrl: 'http://shanghai.wenhuayun.cn',
  basePath: 'shyd.wenhuayun.cn',/*  */
  gateway: 'https://gateway.wenhuayun.cn',
  mdUrl: 'http://shanghaistore.wenhuayun.cn',
  shopProvince: 'sh',
  ssApi: 'https://whymss.wenhuayun.cn',
  getCaptchaUrl: 'http://china.wenhuayun.cn',
  payUrl: "https://whym.wenhuayun.cn",
  china: 'http://china.wenhuayun.cn',
}
const devServe = {
  shopPath: 'sh',
  apiUrl: 'http://emeshanghai.wenhuayun.cn',
  basePath: 'emeshanghaiyd.wenhuayun.cn',/*  */
  gateway: 'https://emegateway.wenhuayun.cn',
  mdUrl: 'http://shanghaistore.wenhuayun.cn',
  shopProvince: 'sh',
  ssApi: 'https://memess.wenhuayun.cn',
  getCaptchaUrl: 'https://emechina.wenhuayun.cn',
  payUrl: "https://meme.wenhuayun.cn",
  china: 'http://china.wenhuayun.cn',
}

const isProduction = false// change pro
const serveConfig = isProduction ? proServe : devServe;
(function (factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? exports.serveConfig = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global = global || self, global.serveConfig = factory());
}(function () {
  return serveConfig
}));
