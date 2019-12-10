/* Layout */
import Layout from '../../views/layout/Layout'

const _import = require('../_import_' + process.env.NODE_ENV)

export default {
  path: '/member',
  component: Layout,
  redirect: '/member/memberList',
  name: 'member',
  meta: {
    title: '会员管理',
    icon: 'member',
  },
  children: [{
    path: 'memberList',
    component: _import('memberManagement/memberList'),
    name: 'memberList',
    meta: {
      title: '会员列表',
    }
  },{
    path: 'memberAddress',
    component: _import('memberManagement/memberAddress'),
    name: 'memberAddress',
    meta: {
      title: '收货地址',
    }
  },{
    path: 'memberMessage',
    component: _import('memberManagement/memberMessage'),
    name: 'memberMessage',
    meta: {
      title: '会员消息',
    }
  },{
    path: 'memberActivity',
    component: _import('memberManagement/memberActivity'),
    name: 'memberActivity',
    meta: {
      title: '会员活动参与记录',
    }
  },{
    path: 'memberInviteRecord',
    component: _import('memberManagement/memberInviteRecord'),
    name: 'memberInviteRecord',
    meta: {
      title: '会员分享关系',
    }
  }]
}
