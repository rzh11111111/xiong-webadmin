/* Layout */
import Layout from '../../views/layout/Layout'

const _import = require('../_import_' + process.env.NODE_ENV)

export default {
  path: '/approval',
  component: Layout,
  redirect: '/approval/approvalList',
  name: 'approval',
  meta: {
    title: '审核管理',
    icon: 'approval',
    // roles: ['admin', 'editor']
  },
  children: [{
    path: 'approvalList',
    component: _import('approvalManagement/approvalList'),
    name: 'approvalList',
    meta: {
      title: '一般审核',
      // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
    }
  }, {
    path: 'shopClue',
    component: _import('approvalManagement/shopClue'),
    name: 'shopClue',
    meta: {
      title: '同城企业预推广',
      // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
    }
  // }, {
  //   path: 'storeApprovalt',
  //   component: _import('approvalManagement/store/storeApprovalt'),
  //   name: 'storeApprovalt',
  //   meta: {
  //     title: '特色商户审批',
  //     // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
  //   }
  // }, {
  //   path: 'shopApproval',
  //   component: _import('approvalManagement/shop/shopApproval'),
  //   name: 'shopApproval',
  //   meta: {
  //     title: '生产企业审批',
  //     // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
  //   }
  // }, {
  //   path: 'shopApprovalt',
  //   component: _import('approvalManagement/shop/shopApprovalt'),
  //   name: 'shopApprovalt',
  //   meta: {
  //     title: '同城企业审批',
  //     // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
  //   }
  // }, {
  //   path: 'goodsApproval',
  //   component: _import('approvalManagement/goods/goodsApproval'),
  //   name: 'goodsApproval',
  //   meta: {
  //     title: '商品审批',
  //     // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
  //   }
  // }, {
  //   path: 'approval/:id',
  //   component: _import('approvalManagement/approval'),
  //   name: '',
  //   meta: {
  //     title: '',
  //     // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
  //   }
  }, {
    path: 'approvalRecord',
    component: _import('approvalManagement/approvalRecord'),
    name: 'approvalRecord',
    meta: {
      title: '审核记录',
      // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
    }
  }, {
    path: 'auditConfiguration',
    component: _import('approvalManagement/auditConfiguration'),
    name: 'auditConfiguration',
    meta: {
      title: '审核配置',
      // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
    }
  }]
}
