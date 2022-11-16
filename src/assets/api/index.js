import { HTTP } from '@/utils/request'
const axios = new HTTP('/api/proxy');
export function editTerminalUser(data) {
    return axios.post('/apiTerminalUser/editTerminalUser.do', { ...data }, { hasForm: true })
}
