// 导入ali-oss
import OSS from 'ali-oss';
import { getSignInfo } from '../assets/api/gateway';
const { serveConfig } = require('./config.serve');
/**
 * 配置信息
 */
// const region = "oss-cn-hangzhou"; // 换成自己的region
// const accessKeyId = ""; // 换成自己的accessKeyId
// const accessKeySecret = ""; // 换成自己的accessKeySecret
// const bucket = "culturecloud"; // 换成自己的bucket
window.ossData = JSON.parse(window.localStorage.getItem("ossData"))||{};
window.client = {};
let CooOssObj = {
    install: function (Vue) {
        const expire = 0;
        var creat = serveConfig;
        // 获取阿里上传参数
        function getAliOsssign() {
            // 可以判断当前expire是否超过了当前时间， 如果超过了当前时间， 就重新取一下，3s 作为缓冲。
            let now = Date.parse(new Date()) / 1000;
            if (expire < now + 3) {
                getSignInfo({ shopPath: creat.shopPath }).then(res => {
                    if (res.status != 200) {
                        return
                    }
                    ossData = res.data || {};
                    client = new OSS({
                        region: 'oss-accelerate',
                        accessKeyId: ossData.accessId,
                        accessKeySecret: ossData.accessSecret,
                        bucket: ossData.bucket
                    });
                    window.localStorage.setItem("ossData",JSON.stringify(ossData))
                });
            }
        }
        if (ossData && !ossData.accessSecret) {
            getAliOsssign()
        } else { 
            client = new OSS({
                region: 'oss-accelerate',
                accessKeyId: ossData.accessId,
                accessKeySecret: ossData.accessSecret,
                bucket: ossData.bucket
            });
        }
        function transformation(time) {
            let Y = new Date(time).getFullYear();
            let M = new Date(time).getMonth() + 1;
            let D = new Date(time).getDate();
            let h = new Date(time).getHours();
            let m = new Date(time).getMinutes();
            let timeFormat = "";
            timeFormat =
                Y + '' + M + '' + D + '' + autoAddZero(h);
            return timeFormat;
        }
        /*
         * autoAddZero(): 不足两位，自动补0;
         *
         */
        function autoAddZero(num) {
            return num >= 10 ? num : "0" + num;
        }
        /**
         *
         * @param {上传是设置文件key , 一般为文件名称} objectKey
         * @param {文件file} file
         */
        //  上传
        const CooOss = function (file, options) {
            if (this instanceof CooOss) { //{ parallel: 9, partSize: 1024 * 1024 * 1024, progress
                let fied = creat.shopPath + '/' + transformation(file.lastModified)
                let objectKey = fied + '/' + file.name;
                return new Promise((resolve, reject) => {
                    client.multipartUpload(objectKey, file, options).then((res) => {
                        resolve({
                            uid: file.uid || 1,
                            name: file.name,
                            raw: file,
                            code: 0,
                            objectKey: objectKey,
                            url: this.getOssFileUrl(objectKey),
                            msg: "ok"
                        });
                    }).catch(() => {
                        // console.error('上传出错了');
                        // alert('上传出错了');
                        reject({ code: -1, url: "", objectKey: "", msg: "上传出错了" });
                    });
                })
            } else {
                return new CooOss(file, options);
            }
        };

        // 下载
        const downloadFile = function (key) {
            console.log(key)
            let url = client.signatureUrl(key);
            let Img = new Image(),
                dataURL = '';
            let fileName = key.substring(key.indexOf('_') + 1);
            Img.src = url;
            Img.setAttribute("crossOrigin", 'Anonymous');
            Img.onload = function () {
                let canvas = document.createElement("canvas"),
                    width = Img.width,
                    height = Img.height;
                canvas.width = width;
                canvas.height = height;
                canvas.getContext("2d").drawImage(Img, 0, 0, width, height);
                dataURL = canvas.toDataURL('image/png');
                let eleLink = document.createElement('a');
                eleLink.download = fileName;
                eleLink.style.display = 'none';
                eleLink.href = dataURL;
                document.body.appendChild(eleLink);
                eleLink.click();
                document.body.removeChild(eleLink);
            };
        }
        /**
         *
         * @param {上传是设置文件key 一般是文件名} obecjtKey
         */
        CooOss.prototype.getOssFileUrl = obecjtKey => {
            if (!obecjtKey) return new Error("object key 必须传");
            return "https://" + ossData.bucket + "." + ossData.endpoint + "/" + obecjtKey;
        }
        Vue.prototype.CooOss = CooOss;
        Vue.prototype.downloadFile = downloadFile;
    }

}
export default CooOssObj