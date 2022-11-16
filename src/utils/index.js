// 是否为移动端
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 是否为iOS
export function isiOS() {
  return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}

// 是否为Android
export function isAndroid() {
  return navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1;
}
export function is_weixin() {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
      return true;
  } else {
      return false;
  }
}
//百分比缩放
export function imgPect(picture_width, picture_height, default_width, default_height) {
  var widthRatio = default_width / picture_width;
  var heightRatio = default_height / picture_height;
  var ratio;
  widthRatio < heightRatio ? ratio = widthRatio : ratio = heightRatio;
  var currentImg = { picture_width: parseInt(picture_width * ratio), picture_height: parseInt(picture_height * ratio) };
  return currentImg;
}