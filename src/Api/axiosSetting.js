/**
 * Created by zhangyao 2018/04/12
 */
console.log('2019.4.18')
import axios from 'axios'
import { Loading, Message, MessageBox } from 'element-ui'
import qs from 'qs'
import store from '@/store'
import router from '@/router'
import { setToken, getToken } from '@/utils/auth'
import config from '@/utils/config'
import reponseMsg from './reponseMsg'
let host = ''
if (process.env.NODE_ENV == 'development') { // 本地
  host = config.host
} else if (process.env.NODE_ENV == 'production') { // 生产环境
  host = process.env.BASE_API
}
const AxiosIns = axios.create({
  // baseURL: process.env.BASE_API,
  baseURL: host,
  timeout: 20000,
  ContentType: 'application/x-www-form-urlencoded;charset=UTF-8'
  // withCredentials: true // axios 默认不发送cookie，跨域也是一个原因，需要全局设置
  // ContentType: 'application/json;charset=UTF-8',
})
const timer = []
const delay = 300

class GLoading {
  constructor(ops) {
    this.loadingIns = {
      close() {
      }
    }
    this.options = Object.assign({
      fullscreen: true,
      lock: true,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
      text: '拼命加载中...'
    }, ops)
  }

  open() {
    this.loadingIns = Loading.service(this.options)
  }

  close() {
    try {
      this.loadingIns.close()
    } catch (e) {
      // //Console.log(e);
    }
  }
}

var load = new GLoading()
AxiosIns.interceptors.request.use(config => {
  if (getToken()) {
    // config.headers = Object.assign({}, config.headers, {'Authorization': `Bearer ${getToken()}`});
    config.headers.token = getToken() // 让每个请求携带token-- ['tokenId']为自定义key 请根据实际情况自行修改
  }
  if (config.showFullLoading !== 'close') {
    timer.push(setTimeout(() => {
      // 开启转圈圈
      load.open()
    }, delay))
  }
  // config.data = qs.stringify(config.data)
  return config
}, (error) => {
  return Promise.reject(error)
})

AxiosIns.interceptors.response.use(response => {
  if (response.headers && response.headers.token) {
    setToken(response.headers.token)
  }
  for (var t of timer) {
    clearTimeout(t)
  }
  // 请求结束 清除转圈圈
  load.close()
  try {
    if (response.data) {
      const resData = response.data
      if (resData.status !== 1) {
        if (resData.status === 11 && store.getters.roles.length !== 0) {
          MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '是否重新登录', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('FedLogOut').then(() => {
              location.reload();// 为了重新实例化vue-router对象 避免bug
            });
          })
          return false;
        }
        Message({
          message: resData.message || resData.stateMessage || reponseMsg[resData.status] || '可能无网络或接口请求错误！',
          type: 'error'
        })
        return false
      }
      return resData
      /**
       * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
       * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
       */
      //     if (res.code !== 20000) {
      //       Message({
      //         message: res.message,
      //         type: 'error',
      //         duration: 5 * 1000
      //       });
      //       // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      //       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //         MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
      //           confirmButtonText: '重新登录',
      //           cancelButtonText: '取消',
      //           type: 'warning'
      //         }).then(() => {
      //           store.dispatch('FedLogOut').then(() => {
      //             location.reload();// 为了重新实例化vue-router对象 避免bug
      //           });
      //         })
      //       }
      //       return Promise.reject('error');
      //     }
    }
  } catch (error) {
    // console.log(error)
  }
}, (error) => {
  for (var v of timer) {
    clearTimeout(v)
  }
  // 关闭转圈圈
  load.close()
  Message({
    message: '可能无网络或接口请求错误！', // error.message
    type: 'error'
  })
  try {
    // 401跳登录
    if (error.response) {
      if (error && error.response) {
        switch (error.response.status) {
          case 400:
            Message({
              message: '请求错误！',
              type: 'error'
            })
            break
          case 401:
            Message.error('登录失效，请重新登录。')
            break
          case 403:
            Message({
              message: '拒绝访问！',
              type: 'error'
            })
            break
          case 404:
            Message({
              message: `请求地址出错: ${error.response.config.url}`,
              type: 'error'
            })
            break
          case 500:
            Message({
              message: '服务器内部错误',
              type: 'error'
            })
            break
          default:
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
  return Promise.reject(error)
})
export default AxiosIns
