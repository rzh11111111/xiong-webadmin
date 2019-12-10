import router from './router'
import store from './store'
import {MENU_PERMISSION} from '@/utils/rolePermission'
import {Message} from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import {getToken, removeToken} from '@/utils/auth' // getToken from cookie
import sessionStorage from "./store/sessionStorage";

NProgress.configure({showSpinner: false}) // NProgress配置

const whiteList = ['/login', '/authredirect'] // 没有重定向白名单

router.beforeEach(async (to, from, next) => {
  NProgress.start() // 开始进度条

  if (getToken()) {
    if (to.path === '/login') {
      removeToken()
      NProgress.done() // 如果当前页面是指示板，在每个挂钩后不会触发，所以手动处理它。
      location.reload()
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetUserInfo').then(res_info => { // 拉取user_info
          let resData = res_info.data.menuPermissionMap
          let sysAccessList = []
          if (resData) {
            for (var key in resData) {
              if (resData[key].type === 1) {
                sysAccessList.push({accessResources: key})
              }
            }
          }
          sysAccessList.map(item => {
            item.accessResources = MENU_PERMISSION(item.accessResources)
          })

          store.dispatch('GenerateRoutes', sysAccessList).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({...to, replace: true}) // hack方法 确保addRoutes已完成 ,replace:true，这样导航就不会留下历史记录。
          })
          sessionStorage.$setSessionStorageByName('infoPermission', JSON.stringify(res_info.data));
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error('登录失效，请重新登录。')
            next({path: '/login'})
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // sessionStorage.setItem('justPage', to.path);
      next('/login');
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 完成进度条
})
