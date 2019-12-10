/* Layout */
import Layout from '../../views/layout/Layout'

const _import = require('../_import_' + process.env.NODE_ENV)

export default {
  path: '/order',
  component: Layout,
  redirect: '/order/orderList',
  name: 'order',
  meta: {
    title: '订单管理',
    icon: 'order',
    // roles: ['admin', 'editor']
  },
  children: [{
    path: 'orderList',
    component: _import('orderManagement/orderList'),
    name: 'orderList',
    meta: {
      title: '订单列表',
      // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
    }
  },{
    path: 'offlineOrderList',
    component: _import('orderManagement/offlineOrderList'),
    name: 'offlineOrderList',
    meta: {
      title: '线下订单',
      // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
    }
  },{
    path: 'onlineOrderList',
    component: _import('orderManagement/onlineOrderList'),
    name: 'onlineOrderList',
    meta: {
      title: '线上订单',
      // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
    }
  }]
}
