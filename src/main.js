import {createApp} from 'vue'
import App from './App.vue'
import router from './router.js'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
// iconfont
import '@/assets/css/icon.css'
import '@/icons/iconfont.js'
// 国际化
import i18n from '@/locale'
const app = createApp(App)
// 注册全局svg组件
import SvgIcon from '@c/SvgIcon/index.vue'
app.component('SvgIcon', SvgIcon)
// 设置网页标题
app.directive('title', {
  beforeMount: function(el) {
    document.title = el.dataset.title
  }
})

app.use(i18n)
app.use(ElementPlus, {
  i18n: (key, value) => i18n.global.t(key, value)
})
app
  .use(store)
  .use(router)
  .mount('#app')