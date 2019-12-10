/* Layout */
import Layout from '../../views/layout/Layout'

const _import = require('../_import_' + process.env.NODE_ENV)

export default {
  path: '/operate',
  component: Layout,
  redirect: '/operate/appBaseConfig',
  name: 'operate',
  meta: {
    title: '运营管理',
    icon: 'operate',
  },
  children: [{
    path: 'appConfig',
    component: _import('operateManagement/app/index'),
    name: 'appConfig',
    meta: {
      title: 'app配置'
      // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
    },
    children: [{
      path: 'appBaseConfig',
      component: _import('operateManagement/app/appBaseConfig'),
      name: 'appBaseConfig',
      meta: {
        title: '基础设置'
        // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
      }
    }, {
      path: 'memberLoginRecord',
      component: _import('operateManagement/app/memberLoginRecord'),
      name: 'memberLoginRecord',
      meta: {
        title: '消费者会员登录记录'
        // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
      }
    }, {
      path: 'appBanner',
      component: _import('operateManagement/app/appBanner'),
      name: 'appBanner',
      meta: {
        title: 'Banner'
        // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
      }
    }, {
      path: 'hotWord',
      component: _import('operateManagement/app/hotWord'),
      name: 'hotWord',
      meta: {
        title: '首页热词配置'
        // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
      }
    }, {
      path: 'goodsRecommendation',
      component: _import('operateManagement/app/goodsRecommendation'),
      name: 'goodsRecommendation',
      meta: {
        title: '首页商品推荐'
      }
    }, {
      path: 'shopRecommend',
      component: _import('operateManagement/app/shopRecommend'),
      name: 'shopRecommend',
      meta: {
        title: '商城精选商家'
        // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
      }
    }, {
      path: 'storeRecommend',
      component: _import('operateManagement/app/storeRecommend'),
      name: 'storeRecommend',
      meta: {
        title: '店铺推荐',
        // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
      }
    }]
  }, {
    path: 'activity',
    redirect: '/operate/activity',
    component: _import('operateManagement/activity/index'),
    name: 'activity',
    meta: {
      title: '活动管理'
      // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
    },
    children: [{
      path: 'goodsActivity',
      component: _import('operateManagement/activity/activity'),
      name: 'goodsActivity',
      meta: {
        title: '商品活动'
        // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
      }
    }, {
      path: 'registerActivity',
      component: _import('operateManagement/activity/register'),
      name: 'registerActivity',
      meta: {
        title: '注册活动'
        // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
      }
    }, {
      path: 'inviteRegister',
      component: _import('operateManagement/activity/invite'),
      name: 'inviteRegister',
      meta: {
        title: '邀请注册'
        // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
      }
    }]
  }, {
    path: 'notice',
    redirect: '/operate/notice',
    component: _import('operateManagement/notice/index'),
    name: 'notice',
    meta: {
      title: '通知/公告'
      // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
    },
    children: [{
      path: 'platformNotice',
      component: _import('operateManagement/notice/platformNotice'),
      name: 'platformNotice',
      meta: {
        title: '平台公告',
      }
    }, {
      path: 'activityNotice',
      component: _import('operateManagement/notice/activityNotice'),
      name: 'activityNotice',
      meta: {
        title: '活动通知',
      }
    }]
  }, {
    path: 'feedback',
    redirect: '/operate/feedback',
    component: _import('operateManagement/feedback/index'),
    name: 'feedback',
    meta: {
      title: '意见反馈'
      // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
    },
    children: [{
      path: 'feedbackList',
      component: _import('operateManagement/feedback/feedbackList'),
      name: 'feedbackList',
      meta: {
        title: '意见反馈'
        // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
      }
    }, {
      path: 'businessCooperate',
      component: _import('operateManagement/feedback/businessCooperate'),
      name: 'businessCooperate',
      meta: {
        title: '商务合作'
        // roles: ['admin', 'editor', 'users'] // 或者只能在子导航中设置角色。
      }
    }]
  }]
}
