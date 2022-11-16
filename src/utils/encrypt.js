import app from '@/store/modules/app';
import Vue from 'vue';
const CryptoJS = require('crypto-js');
// const PRD = location.host.match(/wenhuayun.com/); // 根据环境判断逻辑
const KEY = CryptoJS.enc.Utf8.parse('d7f6822a8a52a4c4');
const IV = CryptoJS.enc.Utf8.parse('076ce634d7da11eb');

function Encrypt(clearText) {
  const source = CryptoJS.enc.Utf8.parse(clearText);
  const encrypted = CryptoJS.AES.encrypt(source, KEY, { iv: IV, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.toString();
}

function Decrypt(encrypted) {
  const decrypt = CryptoJS.AES.decrypt(encrypted, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return JSON.parse(CryptoJS.enc.Utf8.stringify(decrypt).toString());
}

// 解密方法
function decodeAesString(str) {
  let KEY = 'd7f6822a8a52a4c4';
  let IV = '076ce634d7da11eb';
  if (KEY.length < 16) throw Error("the key length can't less than 16");
  KEY = KEY.slice(-16);
  KEY = CryptoJS.enc.Utf8.parse(KEY);
  IV = IV.slice(-16);
  IV = CryptoJS.enc.Utf8.parse(IV);
  var HEXOBJ = CryptoJS.enc.Utf8.parse(str);
  var base64Str = CryptoJS.enc.Base64.stringify(HEXOBJ);
  base64Str = CryptoJS.enc.Base64.parse(base64Str).toString(CryptoJS.enc.Utf8);
  return JSON.parse(CryptoJS.AES.decrypt(base64Str, KEY, { iv: IV }).toString(CryptoJS.enc.Utf8));
}
/*
         * transformation(): 转换时间;
         *           time: 转换时间;
         * */
function transformation(time, format = 'MM月DD日 HH:MM', type = '-') {

  if (String(time).indexOf('-') > -1) {
    time = time.replace(/\-/gi, '/');
  }
  let Y = new Date(time).getFullYear();
  let M = new Date(time).getMonth() + 1;
  let D = new Date(time).getDate();
  let W = new Date(time).getDay();
  let h = new Date(time).getHours();
  let m = new Date(time).getMinutes();
  let s = new Date(time).getSeconds();
  let timeFormat = "";
  let week = {
    '1': '周一',
    '2': '周二',
    '3': '周三',
    '4': '周四',
    '5': '周五',
    '6': '周六',
    '0': '周日',
  };
  switch (format) {
    case 'yyyy-mm-dd':
      timeFormat =
        Y + type + autoAddZero(M) + type + autoAddZero(D);
      break;
      case 'yyyy-mm-dd hh:mm:ss':
        timeFormat =
          Y + type + autoAddZero(M) + type + autoAddZero(D) + ' ' + autoAddZero(h) + ':' + autoAddZero(m)+ ':' + autoAddZero(s);
        break;
    case 'yyyy-mm-dd hh:mm':
      timeFormat =
        Y + type + autoAddZero(M) + type + autoAddZero(D) + ' ' + autoAddZero(h) + ':' + autoAddZero(m);
      break;
    case 'yyyy-mm-dd ww':
      timeFormat =
        Y + type + autoAddZero(M) + type + autoAddZero(D) + ' ' + week[W];
      break;
    case 'yyyy':
      timeFormat = Y;
      break;
    case 'mm-dd':
      timeFormat = autoAddZero(M) + type + autoAddZero(D);
      break;
    case 'MM月DD日 HH:MM':
      timeFormat = M + '月' + autoAddZero(D) + '日 ' + autoAddZero(h) + ':' + autoAddZero(m);
      break;
    case 'YYYY年MM月DD日 HH:MM':
      timeFormat =
        Y + '年' + autoAddZero(M) + '月' + autoAddZero(D) + '日 ' + autoAddZero(h) + ':' + autoAddZero(m);
      break;
    case 'YYYY年MM月DD日':
      timeFormat =
        Y + '年' + autoAddZero(M) + '月' + autoAddZero(D) + '日';
      break;
  }
  return timeFormat;
}
/*
        * autoAddZero(): 不足两位，自动补0;
        *
        */
function autoAddZero(num) {
  return num >= 10 ? num : "0" + num;
}
function subText(str, startLength, endLength, num) {
  if (str && str.length == 0 || str == undefined) {
      return "";
  }
  var length = str.length;
  if (length >= startLength + endLength) {
      //判断当字符串长度为二时,隐藏末尾
      if (length <= 10) {
          return '*'.repeat(1) + str.slice(-str.length+1);
      }
      //判断字符串长度大于首尾字符串长度之和时,隐藏中间部分
      else if (length >= 11) {
          return str.substring(0, startLength) + '*'.repeat(num) + str.substring(length - endLength, length);
      } else {
          return str
      }
  }
}
export default {
  Encrypt,
  Decrypt,
  decodeAesString,
  transformation,
  subText
};
