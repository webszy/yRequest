const axios = require('axios')
const axiosRetry = require('axios-retry')
const to = require('await-to-js').default
/**
 *
 *
 * @class Request
 * @param {
 * requestOption, //axios配置项，参考官网
 * interceptors：{//拦截器配置，3个函数
 *  beforeRequest:Function，
 *  beforeResponse:Function，
 *  globalErrorHandler:Function
 * }, 
 * errorHandlers:Map, //处理具体请求失败,基于url path处理
 * retryOption:{
 *  enable: boolean,
 *  times:Nmber
 * }
 * }
 */
class Request {
  constructor({ requestOption,interceptors, errorHandlers, retryOption }) {
    if(requestOption){
      this.Service = axios.create(requestOption)
    } else {
      this.Service = axios.create()
    }
    if(interceptors){
      if(interceptors.beforeRequest&& typeof interceptors.beforeRequest === 'function')
      this.Service.interceptors.request.use(interceptors.beforeRequest)
    }
  }
}
