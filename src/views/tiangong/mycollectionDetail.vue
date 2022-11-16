<template>
<div class="mycollection-detail-box">
    <div class="mycollection-detail-banner">
        <div class="head-box">
            <i class="iconfont icon-ARROW-left-copy" @click="goHome"></i>
        </div>
        <div class="three-box" ref="threeBox">
            <img v-show="isLoading" src="../../assets/images/culture-gather/load.gif" alt="" class="loading-common">
        </div>
        <div :class="['info-body isBackground',{'isBackground':detailList.hasBase==1}]">
            <div class="item-content-right">
                <i class="iconfont icon-fangda" @click="addLink"></i>
            </div>
        </div>
        <img v-show="detailList.spuLevelImage" :src="detailList.spuLevelImage" alt="" class="img2">
    </div>
    <div class="mycollection-detail-info">
        <div class="collection-common-borderBottom">
            <div class="info-title">{{detailList.spuSubtitle}}{{detailList.spuName}}</div>
            <div class="info-item-content">
                <div :class="['item-content-left',{'no-item-content-box':detailList.buyCount>1}]">
                    {{detailList.buyCount>1?'已购'+detailList.buyCount+'份':recordList[0] && recordList[0].seriesNo}}
                </div>
            </div>
        </div>
        <div class="collector-content collection-common-borderBottom desc-item-container">
            <span class="desc-item-label">收藏者</span>
            <p class="desc-item-content">{{detailList.userName?detailList.userName: sub(detailList.userMobileNo,3,4,4)}}</p>
        </div>
        <div class="collector-content collection-common-borderBottom desc-item-container">
            <span class="desc-item-label">份额</span>
            <p class="desc-item-content">{{detailList.buyCount?detailList.buyCount:1}}</p>
        </div>
        <div class="desc-hash-content collection-common-borderBottom">
            <span class="desc-item-label">哈希值<i v-show="!recordList.length">正在上链中...</i></span>
            <div class="desc-hash" v-show="recordList.length" v-for="(item,i) in recordList.slice(0,2)" :key="i">
                <p class="info-box-text">编码：{{item.seriesNo}}</p>
                <p class="info-box-text">交易哈希值：</p>
                <p class="hash-box">
                    <span class="desc-hash-words">{{item.hash}}</span>
                </p>
            </div>
            <div class="foot-box" v-show="recordList.length>2" @click="showPopup('infoDesc')">
                <button>全部哈希值</button>
            </div>
        </div>
        <div class="collector-content collection-common-borderBottom desc-item-container">
            <span class="desc-item-label">创作者</span>
            <p class="desc-item-content">{{detailList.creatorName?detailList.creatorName:''}}</p>
        </div>
        <div class="collector-content collection-common-borderBottom desc-item-container">
            <span class="desc-item-label">监制方</span>
            <p class="desc-item-content">{{detailList.spuProduce?detailList.spuProduce:''}}</p>
        </div>
        <div class="mycollection-certified" v-if="recordList.length">
            <div class="collector-content collection-common-borderBottom desc-item-container">
                <span class="desc-item-label">认证时间</span>
                <p class="desc-item-content"><span>第一份</span> {{recordList[0] && recordList[0].createTime}}</p>
            </div>
            <p class="mycollection-tips">
                温馨提示：数字藏品为虚拟数字商品，而非实物，仅限经实名认证为年满18周岁的中国大陆用户购买。数字藏品的版权由发行方或原创者拥有。
            </p>
            <img src="../../assets/images/tiangong/certified.png" alt="" class="icon-certified">
        </div>
    </div>
    <div class="mycollection-footer">
        <div class="footer-item" @click="addShowBlock">
            <i class="iconfont icon-zhengshu icon-certificate"></i>
            <span>证书</span>
        </div>
        <div class="footer-item" @click="addExamples(true)">
            <i class="iconfont icon-liwuhuodong icon-certificate"></i>
            <span>转赠</span>
        </div>
    </div>
    <ActionSheet :overlay="false" v-model="isShowPop" :title="showPopTit" :round="false" :class="{'book-container':isExamples,'brand-desc-height':infoDesc || blockLink || isCollection,'batch-desc-box':isCollection}" @close="closePopup(false)">
        <div class="desc-book-container" v-show="isExamples">
            <i class="iconfont icon-warning"></i>
            <p class="info-text-book">本数字藏品尚未满足转赠的条件</p>
            <ul class="brand-desc-book">
                <li>数字藏品在购买成功24小时后方可转赠。</li>
                <li>数字藏品不得用于炒作或其他商业用途。</li>
                <li>请用户注意保护个人信息，谨防欺诈风险。由此造成的个人损失与本平台无关。</li>
                <li>注：天工严选官方享有最终解释权。</li>
            </ul>
        </div>
        <div class="brand-desc-myCollect" v-show="infoDesc || blockLink || isCollection">
            <div v-show="blockLink">
                <p class="info-text-box">共<span>{{recordList.length}}</span>个证书</p>
                <ul class="brand-desc-content">
                    <li v-for="(re,r) in recordList" :class="{'transfer-item':re.hash.includes('上链中')}" :key="r" @click="goLink(re)">
                        <p>证书：{{re.seriesNo}}</p>
                        <i class="iconfont icon-arrowRight"></i>
                    </li>
                </ul>
            </div>
            <div v-show="isCollection" class="info-batch-cont">
                <div class="info-batch-head">
                    <p class="info-batch-book">单次转赠最多可选择{{detailList.transferLimit}}份</p>
                    <p class="info-batch-box">
                        <span class="batch-left">
                            <i @click="checkAll" :class="['iconfont select-icon',{'icon-duigou':isCheckAll}]"></i>批量选择
                        </span>
                        <span class="batch-right">已选<i>{{checkList.length}}</i>份</span>
                    </p>
                </div>
                <ul class="brand-desc-content no-bottom-content">
                    <li v-for="(res,e) in recordList" :key="e" :class="{'transfer-item':res.transferStatus == 1 || !res.timeStatus}" @click="addCheckNum(e,res)">
                        <p>
                            <span>编码：{{res.seriesNo}}</span>
                            <span :class="['load',{'active':res.transferType==2 && res.transferStatus!=1}]">{{res | setTransferName}}</span>
                        </p>
                        <i :class="['iconfont select-icon',{'icon-duigou':res.bool}]"></i>
                    </li>
                </ul>

                <div class="submit-box-batch" @click.stop="addSubmit">
                    <button>确定</button>
                </div>
            </div>
            <ul class="block-link-content" v-show="infoDesc">
                <li v-for="(ele,r) in recordList" :key="r">
                    <p class="info-text-box">编码：{{ele.seriesNo}}</p>
                    <p class="info-text-box info-bottom">交易哈希值：</p>
                    <div class="info-code">
                        <p>{{ele.hash}}</p>
                    </div>
                </li>
            </ul>
        </div>
    </ActionSheet>
    <pubilcPopBox :iscanle="iscanle" @addcanle="addcanle" :content="errContent" :ispopshow="ispopshow" @callback="callback" :iscallback="iscallback">
    </pubilcPopBox>

</div>
</template>

*/

<script>
import {
    myGoodDetail,
    checkCondition,
    mySpuDetail,
} from '@/assets/api/gateway';
import {
    is_weixin
} from '@/utils/index';
import {
    ImagePreview,
    ActionSheet,
    Toast
} from 'vant';
import pubilcPopBox from '@/components/culture-gather/public-pop-box';
import encrypt from '@/utils/encrypt.js';
export default {
    name: 'cultureMycollectionDetail',
    components: {
        pubilcPopBox,
        ActionSheet
    },
    data() {
        return {
            isLoading: true,
            detailList: {
                nftRecord: {
                    hash: ""
                }
            },
            id: this.$route.query.id || '',
            spuId: this.$route.query.spuId || '',
            type: this.$route.query.type || '',
            // 到浏览器下载提示
            isShowTips: false,
            isShowPop: false,
            showPopTit: "温馨提示",
            infoDesc: false,
            blockLink: false,
            isExamples: false,
            isCollection: false,
            ispopshow: false,
            errContent: '',
            iscanle: true,
            iscallback: () => {},
            recordList: [],
            checkList: [],
            isCheckAll: false,

        }
    },
    created() {
        this.getList();
    },
    filters: {
        setTransferName({
            transferType,
            transferStatus,
            hash,
            timeStatus
        }) {
            if (hash.includes('上链中')) return '上链中...';
            if (transferStatus == 1) return '转赠中...';
            if (transferType == 2 && transferStatus != 1) return '受赠藏品';
            if (!timeStatus) return '新购持有未满24小时'
            return ''
        },
    },
    methods: {
        addSubmit() {
            if (!this.checkList.length) return;
            if (this.checkList.length) {
                window.sessionStorage.removeItem('nftRecordId');
                return this.addCondition({
                    checkType: 2
                })
            }
        },
        sub(str, startLength, endLength, num) {
            return encrypt.subText(str, startLength, endLength, num)
        },
        addCondition({
            id,
            bool,
            ele,
            val,
            checkType
        }) { //检验是否能够转赠
            let query = {
                spuId: this.spuId || this.detailList.spuId,
                shopPath: this.$route.params.shopPath,
                checkType
            }
            checkType == 1 ? query.nftRecordId = id : query.nftRecordIds = this.checkList;
            checkCondition(query).then(res => {
                if (res.status != 200) {
                    if (bool) { //多选
                        ele.bool = false;
                        this.recordList.splice(val, 1, ele)
                    }
                    if (res.status == 300) {
                        this.closePopup();
                        return this.addExamples(false)
                    } else {
                        return Toast({
                            message: res.data || res.errMsg,
                            icon: 'fail'
                        });
                    }
                }
                if (bool) {
                    this.checkList.push(id);
                } else {
                    let obj = {
                        spuId: query.spuId
                    }
                    if (checkType == 1) {
                        window.sessionStorage.setItem('nftRecordId', JSON.stringify([id]))
                    } else {
                        window.sessionStorage.setItem('nftRecordId', JSON.stringify(this.checkList))
                    }
                    this.$router.push({
                        name: 'searchExamples',
                        query: obj
                    })

                }
            })
        },
        addCheckNum(val, ele) { //单选、多选
            if (ele.transferStatus == 1 || ele.hash && ele.hash.includes('上链中') || !ele.timeStatus) return //转赠中 || 上链中
            if (!ele.bool && this.checkList.length === this.detailList.transferLimit) {
                return Toast({
                    message: '超出最多可选择个数',
                    icon: 'fail'
                });
            }
            ele.bool = !ele.bool;
            this.recordList.splice(val, 1, ele);
            if (ele.bool) {
                return this.addCondition({
                    id: ele.nftRecordId,
                    bool: true,
                    ele,
                    val,
                    checkType: 1
                })
            } else {
                const idx = this.checkList.findIndex(v => v === ele.nftRecordId);
                this.checkList.splice(idx, 1)
            }
        },
        checkAll() { //全选
            this.isCheckAll = !this.isCheckAll
            if (!this.isCheckAll) {
                this.checkList = [];
                this.recordList.map(v => {
                    v.bool = false
                })
                return
            }
            this.recordList.map(v => {
                if (this.checkList.length !== this.detailList.transferLimit) {
                    if (v.hash.includes('上链中') || !v.timeStatus || v.transferStatus == 1) { //上链中 || 不足24小时 || 转赠中
                        return
                    } else {
                        this.setCheckList(v)
                    }

                }
            })

        },
        setCheckList(v) {
            const idx = this.checkList.findIndex(_v => _v === v.nftRecordId)
            if (idx === -1) {
                this.checkList.push(v.nftRecordId);
                v.bool = true;
            }
        },
        closePopup(bool = false) {
            this.isShowPop = bool;
            this.isCollection = bool;
            this.isExamples = bool;
            this.infoDesc = bool;
            this.blockLink = bool;
        },
        goHome() {
            this.$router.push({
                name: 'cultureUserCenter'
            });
        },
        addLink() {
            this.$router.push({
                name: 'cultureFullScreen',
                query: {
                    spuId: this.spuId || this.detailList.spuId,
                }
            })
        },
        initMarMoset(url = "") {
            let _height = document.documentElement.clientHeight || document.body.clientHeight;
            let num = _height - 600;
            // this.myviewer = new marmoset.WebViewer('100%', num, 'https://culturecloud.oss-cn-hangzhou.aliyuncs.com/ed018b5fa984403ab0651655d2c781bd.mview');
            this.myviewer = new marmoset.WebViewer('100%', num, url);
            let myDivOrSomething = this.$refs.threeBox;
            myDivOrSomething.appendChild(this.myviewer.domRoot);
            this.myviewer.loadScene();
            this.myviewer.onLoad = () => {
                /* do something fun here */
                this.isLoading = false
            };
            // console.log(this.myviewer, 'this.myviewer');
        },
        addcanle(el) {
            this.ispopshow = el;
        },
        callback(el) {
            if (el) {
                this.iscallback();
            }
            this.ispopshow = false;
            this.iscallback = () => {};
        },
        oddSetFun() { //单份转赠
            let ele = this.recordList[0];
            if (ele.hash.includes('上链中')) { //上链中，
                return Toast({
                    message: '转赠流转哈希正在上链中，暂不可转赠。',
                    icon: 'fail'
                });
            } else {
                if (ele.transferStatus == 1) { //转赠中
                    return this.$router.push({
                        name: 'loadingConfirmExamples',
                        query: {
                            id: ele.nftRecordId
                        }
                    })
                }
                //校验能否转赠
                return this.addCondition({
                    id: ele.nftRecordId,
                    checkType: 1
                });
            }
        },
        doubleSetFun() { //批量转赠
            let hash = this.recordList.every(ele => ele.hash.includes('上链中'));
            if (hash) { //上链中，
                return Toast({
                    message: '转赠流转哈希正在上链中，暂不可转赠。',
                    icon: 'fail'
                });
            } else {
                let transferStatus = this.recordList.every(ele => ele.transferStatus == 1);
                if (transferStatus) { //转赠中
                    return Toast({
                        message: '藏品转赠中，暂无可转赠的藏品。',
                        icon: 'fail'
                    });
                }
                let timeStats = this.recordList.every(ele => !ele.timeStatus);
                if (timeStats) { //全部不足24小时
                    return this.addExamples(false)
                }
                return this.showPopup('isCollection');
            }
        },
        addExamples(bool) {
            if (bool) {
                if (this.recordList.length == 1) {
                    this.oddSetFun();
                } else {
                    this.doubleSetFun();
                }
            } else {
                return this.showPopup('isExamples');
            }
        },
        showPopup(params) {
            let obj = {
                'infoDesc': '全部哈希值',
                'isExamples': '温馨提示',
                'blockLink': '全部证书',
                'isCollection': '请选择藏品'
            }
            this.showPopTit = obj[params];
            this.isShowPop = true;
            this[params] = true;

        },
        getList() {
            let obj = {};
            let attr = '';
            if (this.type) {
                attr = mySpuDetail;
                obj = {
                    transferId: this.id,
                    shopPath: this.$route.params.shopPath,
                };
            } else {
                attr = myGoodDetail;
                obj = {
                    shopPath: this.$route.params.shopPath,
                    orderId: this.id,
                    spuId: this.spuId,
                }
            }
            attr(obj).then(res => {
                if (res.status != 200) {
                    return
                }
                let data = res.data || {};
                console.log(data, 'dddddddd')
                this.detailList = data;
                let list = data.recordList || [];
                this.recordList = list.map(ele => {
                    ele.bool = false;
                    return ele;
                });
                this.$nextTick(() => {

                    if (this.myviewer && this.myviewer.sceneURL) {
                        let myDivOrSomething = this.$refs.threeBox;
                        myDivOrSomething.removeChild(this.myviewer.domRoot)
                    }
                    this.initMarMoset(this.detailList.spuModelUrl);
                    this.$forceUpdate();
                })
            });
        },
        getImg(url) {
            let images = [url]
            let index = 0
            ImagePreview({
                images: images,
                showIndex: false,
                loop: false, //是否循环播放
                startPosition: index
            })
        },
        urlToBase64(url) {
            return new Promise((resolve, reject) => {
                let image = new Image();
                image.onload = function () {
                    let canvas = document.createElement('canvas');
                    canvas.width = this.naturalWidth;
                    canvas.height = this.naturalHeight;
                    // 将图片插入画布并开始绘制
                    canvas.getContext('2d').drawImage(image, 0, 0);
                    // result
                    let result = canvas.toDataURL('image/png')
                    resolve(result);
                };
                // CORS 策略，会存在跨域问题https://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror
                // 虽然设置了image.crossOrigin来解决跨域问题，但有时候还是会出现跨域错误，这是因为图片url的缓存
                image.setAttribute('crossOrigin', 'anonymous');
                // 需要加个随机数防止缓存即可
                image.src = url + '?v=' + Math.random()
                // 图片加载失败的错误处理
                image.onerror = () => {
                    reject(new Error('urlToBase64 error'));
                }
            })
        },
        //下载
        downloadIamge(fileName, content) {
            this.ispopshow = true;
            this.errContent = '保存图片到你的相册';
            this.callback = () => {
                if (is_weixin()) {
                    return this.isShowTips = true
                }

                let aLink = document.createElement('a');
                this.urlToBase64(content).then(res => {
                    let blob = this.base64ToBlob(res); //new Blob([content]);
                    let evt = document.createEvent("HTMLEvents");
                    evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
                    aLink.download = fileName;
                    aLink.href = URL.createObjectURL(blob);
                    aLink.click()

                })
            }

        },
        //base64转blob
        base64ToBlob(code) {
            let parts = code.split(';base64,');
            let contentType = parts[0].split(':')[1];
            let raw = window.atob(parts[1]);
            let rawLength = raw.length;

            let uInt8Array = new Uint8Array(rawLength);

            for (let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }
            return new Blob([uInt8Array], {
                type: contentType
            });
        },
        addShowBlock() {
            if (this.recordList.length == 1) {
                let ele = this.recordList[0];
                this.goLink(ele, true)
            } else {
                let hash = this.recordList.every(ele => ele.hash.includes('上链中'));
                if (hash) { //上链中，
                    return Toast({
                        message: '证书哈希正在上链中，暂不可查看。',
                        icon: 'fail'
                    });
                } else {
                    this.showPopup('blockLink')
                }

            }

        },
        goLink(ele, bool) {
            if (ele.hash && !ele.hash.includes('上链中')) {
                return this.$router.push({
                    name: 'cultureCertificateDetail',
                    query: {
                        id: ele.recordEntityId,
                        nftContractId: ele.nftContractId,
                        type: this.type
                    }
                })
            } else {
                if (bool) {
                    return Toast({
                        message: '证书哈希正在上链中，暂不可查看。',
                        icon: 'fail'
                    });
                }
            }
        },
    },
    destroyed() {
        let myDivOrSomething = this.$refs.threeBox;
        if (this.myviewer && this.myviewer.sceneURL && myDivOrSomething) {
            myDivOrSomething.removeChild(this.myviewer.domRoot);
            this.myviewer.unload()
        }
        this.myviewer.unload()
        this.myviewer = null;
    },
}
</script>

<style lang="scss">
@import '../../styles/tiangong/commen.scss';
</style><style lang="scss" scoped>
@import '../../styles/tiangong/mycollection-detail.scss';
</style>
