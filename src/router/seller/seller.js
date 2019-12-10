/* Layout */
import Layout from '../../views/layout/Layout'

const _import = require('../_import_' + process.env.NODE_ENV)

export default {
  path: '/seller',
  component: Layout,
  redirect: '/seller/storeList',
  name: 'seller',
  meta: {
    title: '店铺管理',
    icon: 'seller',
    // roles: ['admin', 'editor']
  },
  children: [{
    path: 'cityWide',
    component: _import('shopManagement/cityWide'),
    name: 'cityWide',
    meta: {
      title: '同城企业管理',
      // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
    }
  }, {
    path: 'mfrs',
    component: _import('shopManagement/mfrs'),
    name: 'mfrs',
    meta: {
      title: '生产企业管理',
      // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
    }
  }, {
    path: 'mfrsForm',
    component: _import('shopManagement/mfrsForm'),
    name: 'mfrsForm',
    meta: {
      title: '创建生产企业',
      // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
    }
  }, {
    path: 'storeList',
      component: _import('storeManagement/storeList'),
      name: 'storeList',
      meta: {
        title: '商圈管理',
        // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
      }
  }, {
    path: 'storeClassify',
    component: _import('storeManagement/storeClassify'),
    name: 'storeClassify',
    meta: {
      title: '商圈内部分类',
      // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
    }
  }, {
    path: 'storeClassifyOutside',
    component: _import('storeManagement/storeClassifyOutside'),
    name: 'storeClassifyOutside',
    meta: {
      title: '商圈外部分类',
      // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
    }
  }, {
  //   path: 'tiedCard',
  //   component: _import('storeManagement/tiedCard'),
  //   name: 'tiedCard',
  //   meta: {
  //     title: '店铺绑卡列表',
  //     // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
  //   }
  // }, {
    path: 'storeData',
    component: _import('storeManagement/storeData'),
    name: 'storeData',
    meta: {
      title: '店铺资料管理',
      // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
    }
  }, {
  //   path: 'storeRate',
  //   component: _import('storeManagement/storeRate'),
  //   name: 'storeRate',
  //   meta: {
  //     title: '店铺费率管理',
  //     // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
  //   }
  // }, {
    path: 'sellerSearchRecord',
    component: _import('sellerManagement/sellerSearchRecord'),
    name: 'sellerSearchRecord',
    meta: {
      title: '商户搜索记录',
      // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
    }
  }]
}
