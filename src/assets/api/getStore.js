import { HTTP } from '@/utils/request'
const axios = new HTTP('/api/getstore');

export function getWxSign(data) {
    return axios.post('/sh/wechat/getWxSign.do', { ...data }, { hasForm: true })
}