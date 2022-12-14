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
//???????????????
export function flowUpdate(data) {
    return axios.post('/flow/flowMongo/update', { ...data })
}
//???????????????
export function flowAdd(data) {
    return axios.post('/flow/flowMongo/add', { ...data })
}
//NFT????????????
export function infoList(data) {
    return axios.post('/nft/virtualCommodity/info/list', { ...data })
}
//NFT????????????
export function infoDetail(data) {
    return axios.post('/nft/virtualCommodity/info/detail', { ...data })
}
//?????????????????????
export function getuserPurchase(data) {
    return axios.post('/nft/userPurchase/getuserPurchase', { ...data })
}
//???????????????????????????
export function joinUserPurchase(data) {
    return axios.post('/nft/userPurchase/joinUserPurchase', { ...data })
}
//???????????????
export function tradeWapPay(data) {
    return axios.post('/why/wechatPay/tradeWapPay', { ...data })
}
//????????????????????????
export function checkCondition(data) {
    return axios.post('/nft/virtualCommodity/transfer/checkCondition', { ...data })
}
//???????????????????????????
export function queryUserInfoByMobile(data) {
    return axios.post('/user/terminalUser/queryUserInfoByMobile', { ...data })
}
//??????????????????
export function transferSpuInfo(data) {
    return axios.post('/nft/virtualCommodity/transfer/transferSpuInfo', { ...data })
}
//??????????????????????????????
export function setTransferPwd(data) {
    return axios.post('/nft/transferPwd/setTransferPwd', { ...data })
}
//???????????????????????????????????????
export function checkUserPwd(data) {
    return axios.post('/nft/transferPwd/checkUserPwd', { ...data })
}
//??????????????????
export function checkUserAuth(data) {
    return axios.post('/nft/transferPwd/checkUserAuth', { ...data })
}
//??????????????????
export function saveTransferPwd(data) {
    return axios.post('/nft/transferPwd/saveTransferPwd', { ...data })
}
//??????????????????
export function onTransferSpuInfo(data) {
    return axios.post('/nft/virtualCommodity/transfer/onTransferSpuInfo', { ...data })
}
//???????????????????????????
export function receiverSpuList(data) {
    return axios.post('/nft/virtualCommodity/transfer/receiverSpuList', { ...data })
}
//???????????????????????????
export function receiverSpuInfo(data) {
    return axios.post('/nft/virtualCommodity/transfer/receiverSpuInfo', { ...data })
}
//?????? or ???????????? 
export function receiveOrBackSpu(data) {
    return axios.post('/nft/virtualCommodity/transfer/receiveOrBackSpu', { ...data })
}
//??????????????????
export function mySpuDetail(data) {
    return axios.post('/nft/virtualCommodity/transfer/mySpuDetail', { ...data })
}
//????????????????????????????????????
export function sendCheckMsg(data) {
    return axios.post('/nft/transferPwd/sendCheckMsg', { ...data })
}
//?????????????????????????????????
export function checkResetPwdCode(data) {
    return axios.post('/nft/transferPwd/checkResetPwdCode', { ...data })
}
//?????????????????????????????????
export function getModuleFullScreen(data) {
    return axios.post('/nft/virtualCommodity/spu/getModuleFullScreen  ', { ...data })
}
