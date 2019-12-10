/* Layout */
import Layout from '../../views/layout/Layout'

const _import = require('../_import_' + process.env.NODE_ENV)
export default {
  path: '/goods',
  component: Layout,
  redirect: '/goods/productionGoods/proShelvesGoods',
  name: 'goods',
  meta: {
    title: '商品管理',
    icon: 'goods',
    // roles: ['admin', 'editor']
  },
  children: [
    {
      path: 'productionGoods',
      component: _import('goodsManagement/productionGoods/index'), // Parent router-view
      name: 'productionGoods',
      meta: {title: '生产企业'},
      redirect: '/goods/productionGoods/proShelvesGoods',
      children: [{
        path: 'proShelvesGoods',
        component: _import('goodsManagement/productionGoods/proShelvesGoods/index'),
        name: 'proShelvesGoods',
        meta: {
          title: '出售中商品',
          // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
        }
      }, {
        path: 'proNoShelvesGoods',
        component: _import('goodsManagement/productionGoods/proNoShelvesGoods/index'),
        name: 'proNoShelvesGoods',
        meta: {
          title: '仓库中商品',
          // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
        }
      }, {
        path: 'productionCategory',
        component: _import('goodsManagement/productionGoods/productionCategory/index'),
        name: 'productionCategory',
        meta: {
          title: '外部展示类目',
          // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
        }
      }]
    }, {
      path: 'sameCity',
      component: _import('goodsManagement/sameCity/index'), // Parent router-view
      name: 'sameCity',
      meta: {title: '同城企业'},
      redirect: '/goods/sameCity/cityShelvesGoods',
      children: [{
        path: 'cityShelvesGoods',
        component: _import('goodsManagement/sameCity/cityShelvesGoods/index'),
        name: 'cityShelvesGoods',
        meta: {
          title: '出售中商品',
          // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
        }
      }, {
        path: 'cityNoShelvesGoods',
        component: _import('goodsManagement/sameCity/cityNoShelvesGoods/index'),
        name: 'cityNoShelvesGoods',
        meta: {
          title: '仓库中商品',
          // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
        }
      }, {
        path: 'cityCategory',
        component: _import('goodsManagement/sameCity/cityCategory/index'),
        name: 'cityCategory',
        meta: {
          title: '外部展示类目',
          // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
        }
      }]
    },
    {
      path: 'publicSettings',
      component: _import('goodsManagement/publicSettings/index'), // Parent router-view
      name: 'publicSettings',
      meta: {title: '公共配置'},
      redirect: '/goods/goodsClassification/goodsClassification',
      children: [{
        path: 'goodsBrands',
        component: _import('goodsManagement/publicSettings/goodsBrands/index'),
        name: 'goodsBrands',
        meta: {
          title: '品牌管理',
          // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
        }
      }, {
        path: 'goodsClassification',
        component: _import('goodsManagement/publicSettings/goodsClassification/index'),
        name: 'goodsClassification',
        meta: {
          title: '内部类目管理',
          // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
        }
      }, {
        path: 'goodsAttribute',
        component: _import('goodsManagement/publicSettings/goodsAttribute/index'),
        name: 'goodsAttribute',
        meta: {
          title: '属性管理',
          // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
        }
      }, {
        path: 'goodsGroup',
        component: _import('goodsManagement/publicSettings/goodsGroup/index'),
        name: 'goodsGroup',
        meta: {
          title: '商品分组',
          // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
        }
      }]
    }, {
      path: 'goodsList',
      component: _import('goodsManagement/goodsList'),
      name: 'goodsList',
      meta: {
        title: '商品列表',
        // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
      }
    }, {
      path: 'goodsSearchRecord',
      component: _import('goodsManagement/goodsSearchRecord'),
      name: 'goodsSearchRecord',
      meta: {
        title: '商品搜索记录',
        // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
      }
    }]
}
