import axios from 'axios'
import {useUserStore} from '../store/modules/user'
let userStore = useUserStore()
const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 15000,
  // 跨域时候允许携带凭证
  withCredentials: true
})
//请求拦截
instance.interceptors.request.use(config=>{
  config.headers['token']=userStore.token
  return config
},err=>{
  return Promise.reject(err)
})
// 响应拦截
instance.interceptors.response.use(res => {
  return res;
}, (error) => {
  return Promise.reject(error)
}
);
export default instance
