'use strict'
import axios from 'axios'
import router from '../router';
import qs from 'qs';
const { serveConfig } = require('./config.serve');
class HTTP {
    constructor(baseURL) {
        this.axiosInstance = axios.create({
            baseURL: baseURL || process.env.BASE_API,
            timeout: 30000
        })
        this.init()
    }
    init() {
        this.setRequestInterceptors()
        this.setResponseInterceptors()
    }

    // 处理状态码异常
    async handleStatusError(data) {
        // 请求出错，封装对象，跳转到缺省页
        const message = data.message;
        let resultMesg = '';
        let resultCode = '420'; // 默认420为客户端错误
        if (message === 'Network Error') {
            resultMesg = '网络异常，请检查网络。';
        } else if (message.indexOf('timeout') > -1) {
            resultMesg = '请求超时，请返回后重试。';
        } else if (message.indexOf('status code 302') > -1) {
            resultCode = '302';
            resultMesg = '服务器 nginx 代理转发异常 重定向';
        } else if (message.indexOf('status code 404') > -1) {
            resultCode = '404';
            resultMesg = '啊喔~请求的资源已失效。';
        } else if (message.indexOf('405 Not Allowed') > -1) {
            resultCode = '405';
            resultMesg = '服务器 nginx 代理转发异常';
        } else if (message.indexOf('status code 520') > -1) {
            resultCode = '520';
            resultMesg = '服务器异常，页面加载失败。';
        } else {
            resultCode = '500';
            resultMesg = '网络异常，请检查网络。';
        }
        // router.push({
        //     name: 'defaultPage',
        //     query: {
        //         resultCode,
        //         resultMesg
        //     }
        // });

        return resultMesg
    }

    formatResponse(response) {
        if (!response.data) {
            return Promise.reject(this.handleStatusError(response))
        }
        const _data = response.data
        const { data, status } = _data
        if (data && status) {
            if (status === 200 || status === 500) {
                return _data
            }
        }
        return _data
    }

    // 响应拦截器
    setResponseInterceptors() {
        this.axiosInstance.interceptors.response.use(
            async response => {
                const { config, data } = response || {}
                if (config.responseType === 'blob') {
                    if (data && data instanceof Blob) {
                        try {
                            const res = await data.text()
                            JSON.parse(res)
                            return Promise.reject(res)
                        } catch (error) {
                            return response
                        }
                    }
                    return response
                } else {
                    return this.formatResponse(response)
                }
            },
            error => {
                return Promise.reject(this.handleStatusError(error))
            }
        )
    }

    // 请求拦截器
    setRequestInterceptors() {
        this.axiosInstance.interceptors.request.use(
            config => {
                const jwtToken = localStorage.getItem('jwtToken') || '';
                config.headers['jwtToken'] = jwtToken; // 让每个请求携带自定义token 请根据实际情况自行修改
                config.headers['sysPlatform'] = 'wap';
                if (config.method === 'post') {
                    config.data = {
                        shopProvince: serveConfig.shopProvince,
                        ...config.data
                    }
                    if (config.hasForm) {
                        config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
                        config.data = qs.stringify(config.data)
                    }
                } else {
                    config.params = {
                        shopProvince: serveConfig.shopProvince,
                        ...config.params
                    }
                }
                return config
            },
            error => {
                return Promise.reject(this.handleStatusError(error))
            }
        )
    }

    get(url, params, config = {}) {
        return this.axiosInstance
            .get(url, {
                params: {
                    ...params,
                    _t: new Date().getTime() // 防止请求时读缓存中的数据
                },
                ...config
            })
            .catch(e => {
                console.log(e)
            })
    }

    post(url, data, config = {}) {
        return this.axiosInstance.post(url, data, config)
    }
}

const instance = new HTTP()
export { instance as default, HTTP }
