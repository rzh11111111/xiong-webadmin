// 引入babel编译环境
import 'babel-polyfill'
import Vue from 'vue'
import 'normalize.css/normalize.css' // css重置。

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // 全局的css

import App from './App'
import router from './router'
import store from './store'
import localStorage from './store/localStorage'
import sessionStorage from './store/sessionStorage'
import Api from '@/Api'
import './icons' // 图标
import './permission' // 权限控制
import * as filters from './filters' // 全局过滤器
import plug from '@/utils/plug'
Vue.use(plug);
Vue.use(Element, {
  size: 'small' // 设置element-ui默认大小medium
})
// 注册全局过滤器。
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// if (module.hot) {
//   console.log(module.hot.accept)
//   module.hot.accept();
// }
Vue.config.productionTip = false
Vue.prototype.Api = Api.testApi // Vue全局使用Api
Vue.prototype.local = localStorage // Vue全局使用localStorage
Vue.prototype.session = sessionStorage // Vue全局使用sessionStorage
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
