import axios from 'axios'
import qs from 'qs'
import {
  Message
} from "element-ui";
import router from "../router/index";
import domMessage from '../utils/messageOnce'
console.log()
/**
 *  http://jdsdweb.keyunzhihui.com  机电版本的地址
 * 可以用  window.location.host 来获取 进行判断是哪所学校
 * 用switch 或者if都可以修改baseURL 进行一个版本维护多个学校
 */ 
let baseURL = '';
baseURL = "http://192.168.1.31:8888" //开发环境
// baseURL = "http://jdsdservice.keyunzhihui.com" //机电环境
// baseURL = "http://192.168.1.60:8888" //李湘本地环境
// baseURL = "http://192.168.1.39:8888" //李志豪本地环境
// baseURL = "http://192.168.1.63:8888" //刘赟本地环境
// if (process.env.NODE_ENV == "development") {
//   baseURL = 'http://192.168.1.49:8888'
// } else if (process.env.NODE_ENV == "production") {
//   baseURL = 'test'
// }

const messageOnce = new domMessage()
const Axios = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  responseType: 'json',
  withCredentials: true, //是否允许携带cookie
  headers: {
    // 'content-Type': 'text/plain'
  }
})

//拦截器
Axios.interceptors.request.use((config) => {
  if (config) {
    config.headers["token"] = localStorage.getItem("token")
    config.headers["Authorization"] = localStorage.getItem('Authorization')
    return config
  }
  // config.headers.Authorization = localStorage.getItem("token")
  // config.headers['Pragma'] = 'no-cache'
  // if (config.method == 'post') {
  //   config.data = qs.stringify(config.data)
  // }
  // return config;
}, (error) => {
  return Promise.reject(error)
})




Axios.interceptors.response.use((response) => {
  // return response
  if (response.status === 200) {
    if (response.data.code === 200) {
      return response
    } else if (
      response.data.code === 1000) { //获取token为空
      messageOnce.warning({
        message: response.data.msg,
        type: 'warning'
      })
      localStorage.removeItem('token')
      router.push('/login')
      return
    } else if (response.data.code === 1001) { //无效token
      localStorage.removeItem('token')
      router.push('/login')
      return
    } else if (response.data.code === 1002) { //过期token
      localStorage.removeItem('token')
      router.push('/login')
      return
    } else if (response.data.code === 1011) { //验证失败，该用户不存在该角色
      messageOnce.warning({
        message: response.data.msg,
        type: 'warning'
      })
    } else if (response.data.code === 201) { //重复提交数据
      messageOnce.warning({
        message: response.data.msg,
        type: 'warning'
      })
    } else {
      return response
    }
  } else {
    Message({
      message: response.data.msg,
      type: 'warning'
    })
    router.push('/login')
    return Promise.reject(response)
  }
}, (err) => {
  return Promise.reject(err)
})



export default Axios