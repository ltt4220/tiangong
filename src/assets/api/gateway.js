import { HTTP } from '@/utils/request'
const axios = new HTTP('/api/gateway');
export function bannerList(data) {
    return axios.post('/nft/virtualCommodity/banner/bannerList', { ...data })
}
export function spuList(data) {
    return axios.post('/nft/virtualCommodity/spu/list', { ...data })
}
export function spuDetail(data) {
    return axios.post('/nft/virtualCommodity/spu/detail', { ...data })
}
export function orderBook(data) {
    return axios.post('/nft/virtualCommodity/order/book', { ...data })
}
export function bookDetail(data) {
    return axios.post('/nft/virtualCommodity/order/bookDetail', { ...data })
}
export function commentAdd(data) {
    return axios.post('/why/comment/add', { ...data })
}
export function replyAdd(data) {
    return axios.post('/why/reply/add', { ...data })
}
export function stayOrder(data) {
    return axios.post('/nft/virtualCommodity/order/addOrder', { ...data })
}
export function commentList(data) {
    return axios.post('/why/comment/list', { ...data })
}
export function orderAdd(data) {
    return axios.post('/nft/virtualCommodity/order/add', { ...data })
}
export function withAllSecurity(data) {
    return axios.post('/user/terminalUser/queryTerminalUserWithAllSecurity', { ...data })
}
export function myGoodsNum(data) {
    return axios.post('/nft/virtualCommodity/order/myGoodsNum', { ...data })
}
export function myGoodsList(data) {
    return axios.post('/nft/virtualCommodity/order/myGoodsList', { ...data })
}
export function byUserId(data) {
    return axios.post('/user/terminalUser/queryTerminalUserByUserId', { ...data })
}
export function orderList(data) {
    return axios.post('/nft/virtualCommodity/order/list', { ...data })
}
export function orderDetail(data) {
    return axios.post('/nft/virtualCommodity/order/detail', { ...data })
}
export function myGoodDetail(data) {
    return axios.post('/nft/virtualCommodity/order/myGoodDetail', { ...data })
}
export function orderCancel(data) {
    return axios.post('/nft/virtualCommodity/order/cancel', { ...data })
}
export function myRecordList(data) {
    return axios.post('/nft/virtualCommodity/order/myRecordList', { ...data })
}
export function addFeedback(data) {
    return axios.post('/why/feedback/addFeedback', { ...data })
}
export function userAuth(data) {
    return axios.post('/user/terminalUser/userAuth', { ...data })
}
export function nftRecordList(data) {
    return axios.post('/nft/virtualCommodity/order/nftRecordList', { ...data })
}
export function getSignInfo(data) {
    return axios.post('/why/aliOss/getSignInfo', { ...data })
}
export function nftUser(data) {
    return axios.post('/nft/nftResource/getUser', { ...data })
}
export function signLoginUser(data) {
    return axios.post('/nft/nftResource/signLoginUser', { ...data })
}
export function getMembersUser(data) {
    return axios.post('/nft/virtualCommodity/members/getMembersUser', { ...data })
}
export function membersAdd(data) {
    return axios.post('/nft/virtualCommodity/members/add', { ...data })
}
//访问量更新
export function flowUpdate(data) {
    return axios.post('/flow/flowMongo/update', { ...data })
}
//访问量添加
export function flowAdd(data) {
    return axios.post('/flow/flowMongo/add', { ...data })
}
//NFT资讯列表
export function infoList(data) {
    return axios.post('/nft/virtualCommodity/info/list', { ...data })
}
//NFT资讯详情
export function infoDetail(data) {
    return axios.post('/nft/virtualCommodity/info/detail', { ...data })
}
//是否存在优化购
export function getuserPurchase(data) {
    return axios.post('/nft/userPurchase/getuserPurchase', { ...data })
}
//优化购购买条件判断
export function joinUserPurchase(data) {
    return axios.post('/nft/userPurchase/joinUserPurchase', { ...data })
}
//浏览器支付
export function tradeWapPay(data) {
    return axios.post('/why/wechatPay/tradeWapPay', { ...data })
}
//检验是否能够转赠
export function checkCondition(data) {
    return axios.post('/nft/virtualCommodity/transfer/checkCondition', { ...data })
}
//根据手机号查询用户
export function queryUserInfoByMobile(data) {
    return axios.post('/user/terminalUser/queryUserInfoByMobile', { ...data })
}
//转赠藏品信息
export function transferSpuInfo(data) {
    return axios.post('/nft/virtualCommodity/transfer/transferSpuInfo', { ...data })
}
//判断用户有无设置密码
export function setTransferPwd(data) {
    return axios.post('/nft/transferPwd/setTransferPwd', { ...data })
}
//发送方校验操作密码确认转赠
export function checkUserPwd(data) {
    return axios.post('/nft/transferPwd/checkUserPwd', { ...data })
}
//用户身份校验
export function checkUserAuth(data) {
    return axios.post('/nft/transferPwd/checkUserAuth', { ...data })
}
//保存操作密码
export function saveTransferPwd(data) {
    return axios.post('/nft/transferPwd/saveTransferPwd', { ...data })
}
//保存操作密码
export function onTransferSpuInfo(data) {
    return axios.post('/nft/virtualCommodity/transfer/onTransferSpuInfo', { ...data })
}
//接收方受赠藏品列表
export function receiverSpuList(data) {
    return axios.post('/nft/virtualCommodity/transfer/receiverSpuList', { ...data })
}
//接收方接收藏品信息
export function receiverSpuInfo(data) {
    return axios.post('/nft/virtualCommodity/transfer/receiverSpuInfo', { ...data })
}
//接收 or 拒绝藏品 
export function receiveOrBackSpu(data) {
    return axios.post('/nft/virtualCommodity/transfer/receiveOrBackSpu', { ...data })
}
//受赠藏品详情
export function mySpuDetail(data) {
    return axios.post('/nft/virtualCommodity/transfer/mySpuDetail', { ...data })
}
//重置操作密码发送验证短信
export function sendCheckMsg(data) {
    return axios.post('/nft/transferPwd/sendCheckMsg', { ...data })
}
//重置操作密码校验验证码
export function checkResetPwdCode(data) {
    return axios.post('/nft/transferPwd/checkResetPwdCode', { ...data })
}
//重置操作密码校验验证码
export function getModuleFullScreen(data) {
    return axios.post('/nft/virtualCommodity/spu/getModuleFullScreen  ', { ...data })
}
