import dayjs from 'dayjs';
import { flowAdd, flowUpdate } from '../assets/api/gateway';
const { serveConfig } = require('./config.serve');
const getOs = userAgent => {
  let _result = '';
  const _Obj = {
    windows: 'Windows',
    iphone: 'IPhone',
    mac: 'Mac',
    x11: 'Unix',
    android: 'Android'
  };

  for (const key in _Obj) {
    if (userAgent.includes(key)) {
      _result = _Obj[key];
      break;
    }
  }

  return _result || 'Unknown';
};

const getUuid = (len, radix) => {
  // uuid.js 在这之后引入的，新写一个
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const uuid = [];
  let i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form
    let r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
};
export function handleEenterPv(Vue, routeInfo) {
  const postData = {
    flowId: getUuid(29, 29),
    shopPath: routeInfo.params.shopPath,
    place: serveConfig.shopProvince,
    type: 'pv',
    from: 'h5',
    module:'nft',
    host: window.location.host,
    referer: document.referrer,
    url: window.location.href,
    ip: window.sessionStorage.getItem('ip') || '', // 待处理
    agent: navigator.userAgent.toString(),
    os: getOs(navigator.userAgent.toLowerCase()),
    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    tableName: `pv_${new Date().getFullYear()}`,
    userId: '',
    page: routeInfo.name,
    key:routeInfo.query.id || ''
  };

  localStorage.setItem(
    'pvInfo',
    JSON.stringify({ flowId: postData.flowId, enterTime: new Date().getTime(), fullPath: routeInfo.fullPath })
  );
  flowAdd(postData).then(res => {
    return;
  })
}
export function handleLeavePv(Vue, routeInfo) {
  let info = localStorage.getItem('pvInfo') || '{}';
  const { flowId, enterTime } = JSON.parse(info);
  const _routeIndex = window.location.href.indexOf(routeInfo.fullPath);
  const postData = {
    url: window.location.href.substr(0, _routeIndex) + routeInfo.fullPath,
    tableName: `pv_${new Date().getFullYear()}`,
    place: serveConfig.shopProvince,
    flowId,
    shopPath: routeInfo.params.shopPath,
    shopProvince: serveConfig.shopProvince,
    duration: new Date().getTime() - enterTime
  };
  localStorage.setItem(
    'pvInfo',
    JSON.stringify({ flowId: postData.flowId, enterTime: new Date().getTime(), fullPath: routeInfo.fullPath })
  );
  flowUpdate(postData).then(res => {
    return;
  })
}
