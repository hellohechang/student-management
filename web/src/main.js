import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import pinia from './store'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// svg-icons注册导入
import 'virtual:svg-icons-register'
import SvgIcon from './components/SvgIcon/index.vue'
// 导入所有ElementPlus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app=createApp(App)
app.use(pinia)
app.use(router)
// 将所有图标进行全局注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 全局注册svg组件
app.component('svg-icon',SvgIcon)

app.use(ElementPlus, {
  locale: zhCn,
})
app.mount('#app')
