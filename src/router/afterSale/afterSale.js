/* Layout */
import Layout from '../../views/layout/Layout'

const _import = require('../_import_' + process.env.NODE_ENV)

export default {
  path: '/afterSale',
  component: Layout,
  redirect: '/afterSale/evaluate',
  name: 'afterSale',
  meta: {
    title: '售后管理',
    icon: 'afterSale',
    // roles: ['admin', 'editor']
  },
  children: [{
    path: 'evaluate',
    component: _import('afterSaleManagement/evaluate/index'),
    name: 'evaluate',
    meta: {
      title: '评价管理',
      // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
    },
    children: [{
      path: 'orderEvaluate',
      component: _import('afterSaleManagement/evaluate/order'),
      name: 'orderEvaluate',
      meta: {
        title: '线下订单评价',
        // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
      }
    }, {
      path: 'msfrEvaluate',
      component: _import('afterSaleManagement/evaluate/msfr'),
      name: 'msfrEvaluate',
      meta: {
        title: '生产企业评价',
      }
    }, {
      path: 'cityEvaluate',
      component: _import('afterSaleManagement/evaluate/city'),
      name: 'cityEvaluate',
      meta: {
        title: '同城企业评价',
      }
    }]
  },{
    path: 'refund',
    component: _import('afterSaleManagement/refund/index'),
    name: 'refund',
    meta: {
      title: '订单退款',
      // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
    },
    children: [{
      path: 'refundApply',
      component: _import('afterSaleManagement/refund/refundApply'),
      name: 'refundApply',
      meta: {
        title: '退款申请',
        // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
      }
    }]
  }]
}
