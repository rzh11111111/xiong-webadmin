/* Layout */
import Layout from '../../views/layout/Layout'

const _import = require('../_import_' + process.env.NODE_ENV)

export default {
  path: '/user',
  component: Layout,
  redirect: '/user/departmentList',
  name: 'user',
  meta: {
    title: '用户管理',
    icon: 'user'
    // roles: ['admin']
  }, // 可以在根导航中设置角色。
  children: [{
    path: 'department',
    component: _import('userManagement/department'),
    name: 'department',
    meta: {
      title: '部门管理'
      // roles: ['admin'] // 或者只能在子导航中设置角色。
    }
  }, {
    path: 'roleList',
    component: _import('userManagement/roleList'),
    name: 'roleList',
    meta: {
      title: '角色管理'
      // roles: ['admin'] // 或者只能在子导航中设置角色。
    }
  }, {
    path: 'staffList',
    component: _import('userManagement/staffList'),
    name: 'staffList',
    meta: {
      title: '内部用户管理'
      // roles: ['admin'] // 或者只能在子导航中设置角色。
    }
  }, {
    path: 'externalAccount',
    component: _import('userManagement/externalAccount'),
    name: 'externalAccount',
    meta: {
      title: '外部账号管理'
      // roles: ['admin'] // 或者只能在子导航中设置角色。
    }
  }, {
    path: 'storeSeller',
    component: _import('userManagement/storeSeller'),
    name: 'storeSeller',
    meta: {
      title: '商户账号管理'
      // roles: ['admin'] // 或者只能在子导航中设置角色。
    }
  }, {
    path: 'provinces',
    component: _import('userManagement/provinces'),
    name: 'provinces',
    meta: {
      title: '省区总账号管理'
      // roles: ['admin'] // 或者只能在子导航中设置角色。
    }
  }, {
    path: 'partner',
    component: _import('userManagement/partner'),
    name: 'partner',
    meta: {
      title: '合作商账号管理'
      // roles: ['admin'] // 或者只能在子导航中设置角色。
    }
  }, {
    path: 'promoters',
    component: _import('userManagement/promoters'),
    name: 'promoters',
    meta: {
      title: '推广员账号管理'
      // roles: ['admin'] // 或者只能在子导航中设置角色。
    }
  }]
}
