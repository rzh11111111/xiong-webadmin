import Vue from 'vue'
import Router from 'vue-router'

const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading
Vue.use(Router)
/* Layout */
import Layout from '../views/layout/Layout'

// 引入
import User from './user/user' // 用户管理
import goods from './goods/goods' // 商品管理
import seller from './seller/seller' // 商户管理
import approval from './approval/approval' // 审批管理
import order from './order/order' // 订单管理
import member from './member/member' // 会员管理
import afterSale from './afterSale/afterSale' // 售后管理
import finance from './finance/finance' // 财务管理
import operate from './operate/operate'; //运营管理
import system from './system/system' // 系统管理

/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
 **/
/**
 * hidden: true                   如果“hidden:true”将不会显示在侧边栏(默认为false)
 * alwaysShow: true               如果设置为true，将始终显示根菜单，不管它的子路由长度是多少。
 *                                if not set alwaysShow, only more than one route under the children
 *                                它将变为嵌套模式，否则不会显示根菜单。
 * redirect: noredirect           如果“重定向:noredirect”将不会在breadcrumb中重定向。
 * name:'router-name'             这个名字是用的 <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     将控制页面角色(您可以设置多个角色)
    title: 'title'                在子菜单和breadcrumb(推荐设置)中显示名称
    icon: 'svg-name'              图标显示在侧边栏，
    noCache: true                 如果为true，页面将不会被缓存(默认为假)
  }
 **/
export const constantRouterMap = [
  {
    path: '/login',
    component: _import('login/login'),
    hidden: true
  }, {
    path: '/authredirect',
    component: _import('login/authredirect'),
    hidden: true
  }, {
    path: '/404',
    component: _import('errorPage/404'),
    hidden: true
  }, {
    path: '/401',
    component: _import('errorPage/401'),
    hidden: true
  }, {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: {
        title: '首页', icon: 'home', noCache: true
      }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => (
    {
      y: 0
    }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  User,
  goods,
  order,
  seller,
  approval,
  operate,
  member,
  afterSale,
  finance,
  system,
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    name: 'permission',
    hidden: true,
    meta: {
      title: '权限管理',
      icon: 'lock',
      roles: ['admin', 'editor']
    },
    children: [{
      path: 'index',
      component: _import('permission/index'),
      name: 'index',
      meta: {
        title: '权限测试页',
      }
    }]
  }, {
    path: '/svg',
    component: Layout,
    redirect: '/svg/svg-icons',
    name: 'svg',
    hidden: true,
    meta: {
      title: 'svg',
      icon: 'icon',
      roles: ['admin', 'editor']
    },
    children: [{
      path: 'svg-icons',
      component: _import('svg-icons/index'),
      name: 'svg-icons',
      meta: {
        title: 'svg图标',
        roles: ['admin', 'editor']
      }
    }]
  }, {
    path: '*',
    redirect: '/404',
    hidden: true
  }]
