import { HTTP } from '@/utils/request'
const axios = new HTTP('/api/getCaptchaUrl');

export function loginSendCode(data) {
    return axios.post('/muser/loginSendCode.do', { ...data }, { hasForm: true })
}

export function terminalLogin(data) {
    return axios.post('/frontTerminalUser/terminalLogin.do', { ...data }, { hasForm: true })
}

export function codeLogin(data) {
    return axios.post('/muser/codeLogin.do', { ...data }, { hasForm: true })
}
export function loginEmail(data) {
    return axios.post('/frontTerminalUser/loginEmail.do', { ...data }, { hasForm: true })
}
export function nftUserModifyPwd(data) {
    return axios.post('/frontTerminalUser/nftUserModifyPwd.do', { ...data }, { hasForm: true })
}