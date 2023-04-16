import axios from 'axios'
import { useUserStore } from '../store/modules/user'
import { ElNotification } from "element-plus";
let userStore = useUserStore()
const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 15000,
  // 跨域时候允许携带凭证
  withCredentials: true
})
//请求拦截
instance.interceptors.request.use(config => {
  config.headers['token'] = userStore.token
  return config
}, err => {
  return Promise.reject(err)
})
// 响应拦截
instance.interceptors.response.use(res => {
  // 如果token失效
  if (res.data.status == 2) {
    // 清除用户登录信息 返回登录页
    window.localStorage.removeItem("userStore");
    window.location.href = "/";
  } else if (res.data.status == 1) {
    ElNotification({
      title: '温馨提示',
      message: res.data.message,
      type: "error",
      duration: 3000
    });
  }
  return res;
}, (error) => {
  return Promise.reject(error)
});
export default instance
