const axios = require('axios')
const axiosRetry = require('axios-retry')
const to = require('await-to-js').default
function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}
function isFunction(obj) {
  return obj !== null && typeof obj === 'function'
}
function isArray(arr) {
  return arr !== null && typeof arr === 'object' && arr.length
}
const defaultParam = {
  requestOption: {
    timeoout: 7 * 1000
  },
  interceptors: {},
  errorHandlers: {},
  retryOption: {
    enable: true
  },
  allowMethods: ['get', 'post', 'put', 'delete']
}
/**
 *
 *
 * @class Request
 * @param {
 * requestOption, //axios配置项，参考官网
 * interceptors：{//拦截器配置，3个函数
 *  beforeRequest:Function，
 *  beforeResponse:Function，
 *  responseError:Function
 * }, 
 * allowMethods:Array of method name ,like get post etc
 * errorHandlers:Map, //处理具体请求失败,基于url path处理
 * retryOption:{
 *  enable: boolean,
 *  delay:Number,
 *  retries:number
 * }
 * }
 */
class Request {
  constructor({ requestOption, interceptors, errorHandlers, retryOption, allowMethods } = defaultParam) {
    this.to = to
    this.errorHandlers = errorHandlers
    if (isArray(allowMethods)) {
      this.allowMethods = allowMethods
    } else {
      this.allowMethods = defaultParam.allowMethods
    }

    if (isObject(requestOption)) {
      this.Service = axios.create(requestOption)
    } else {
      this.Service = axios.create()
    }
    if (isFunction(interceptors.beforeRequest)) {
      this.Service.interceptors.request.use(interceptors.beforeRequest)
    }
    let beforeRequest = null
    if (isFunction(interceptors.beforeResponse)) {
      beforeRequest = interceptors.beforeRequest
    } else {
      beforeRequest = response => response.data
    }
    let responseError = null
    if (isFunction(interceptors.responseError)) {
      responseError = interceptors.responseError
    } else {
      responseError = error => console.log('request error', error)
    }
    this.Service.interceptors.response.use(beforeRequest, responseError)
    if (retryOption && retryOption.enable) {
      axiosRetry(this.Service, {
        retries: retryOption.retries || 2,
        retryDelay: delayCount => delayCount * (retryOption.delay || 200)
      })
    }
    return this.output()
  }
  output() {
    const funcList = {
      Service: this.Service
    }
    // for (const method of this.allowMethods) {
    //   const fun_body = "function isObject(obj) {" +
    //     "return (obj !== null && typeof obj === 'object') || typeof obj === 'undefined'" +
    //     "};" +
    //     "const str = new URL(url);" +
    //     "const path = str.pathname;" +
    //     "const p = {method:" + method + "};" +
    //     "if(!url || url===''){ throw new Error('must has url') };" +
    //     "if(!isObject(header)){ throw new Error('header must be Object') } else { p.headers = header };" +
    //     "if(!isObject(param)){ throw new Error('param must be Object') } else { p.param = param };" +
    //     "if(isObject(data)&&p.method.toLowerCase()!=='get'){ p.data=data };" +
    //     "const [err,res] = -this.to(this.Service(p));" +
    //     "if (!err && res) {" +
    //     " return res" +
    //     "} else {" +
    //     " console.log(err);" +
    //     " if(this.errorHandlers&&this.errorHandlers.has(path)){" +
    //     "  const func = this.errorHandlers.get(path);" +
    //     "  func(err);" +
    //     "} }"
    //   console.log('fun_body: ', fun_body);
    //   const name = '_' + method
    //   funcList[name] = new Function('url', 'header', 'param', 'data', fun_body).bind(this)
    // }
    funcList._get = async (url, header, param) => {
      function isObject(obj) {
        return (obj !== null && typeof obj === 'object') || typeof obj === 'undefined'
      };
      const str = new URL(url);
      const path = str.pathname;
      const p = { method: " + method + " };
      if (!url || url === '') { throw new Error('must has url') };
      if (!isObject(header)) { throw new Error('header must be Object') } else { p.headers = header };
      if (!isObject(param)) { throw new Error('param must be Object') } else { p.param = param };
      if (isObject(data) && p.method.toLowerCase() !== 'get') { p.data = data };
      const [err, res] = this.to(this.Service(p));
      if (!err && res) {
      } else {
        console.log(err)
        if (this.errorHandlers && this.errorHandlers.has(path)) {
          const func = this.errorHandlers.get(path);
          func(err);
        }
      }
    }
    return funcList
  }
}

const s = new Request()
console.log('s: ', s);
