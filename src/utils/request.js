import axios from 'axios'
import router from '@/router/routers'
import { Notification } from 'element-ui'
import store from '@/store'
import Config from '@/settings'
import Cookies from 'js-cookie'
import { getToken } from '@/utils/auth'

// axios实例
const service = axios.create({
  baseURL: process.env.NODE_PATH === 'production' ? process.env.VUE_APP_BASE_API : '/',
  timeout: Config.timeout
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      // 让每个请求携带自定义的token
      config.headers['Authorization'] = getToken()
    }
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => {
    Promise.reject(error)
  }
)

export default service
