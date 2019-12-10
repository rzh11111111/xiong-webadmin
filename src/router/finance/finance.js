/* Layout */
import Layout from '../../views/layout/Layout'

const _import = require('../_import_' + process.env.NODE_ENV)

export default {
  path: '/finance',
  component: Layout,
  redirect: '/finance/',
  name: 'finance',
  meta: {
    title: '财务管理',
    icon: 'finance',
    keepAlive: true
    // roles: ['admin', 'editor']
  },
  children: [{
    path: 'pay',
    component: _import('financeManagement/pay/index'),
    name: 'pay',
    meta: {
      title: '见证宝账户',
      keepAlive: true
    },
    redirect: '/finance/pay/anPay',
    children: [{
      path: 'anPay',
      component: _import('financeManagement/pay/anPay'),
      name: 'anPay',
      meta: {
        title: '功能子账户',
        keepAlive: true
      }
    }]
  }, {
    path: 'account',
    component: _import('financeManagement/account/index'),
    name: 'account',
    meta: {
      title: '用户账户',
      keepAlive: true
    },
    redirect: '/finance/account/store',
    children: [{
      path: 'shop',
      component: _import('financeManagement/account/shop'),
      name: 'shopAccount',
      meta: {
        title: '企业店铺账户',
        keepAlive: true
      }
    }, {
      path: 'store',
      component: _import('financeManagement/account/store'),
      name: 'storeAccount',
      meta: {
        title: '商圈店铺账户',
        keepAlive: true
      }
    }, {
      path: 'seller',
      component: _import('financeManagement/account/seller'),
      name: 'sellerAccount',
      meta: {
        title: '商户(店主)账户',
        keepAlive: true
      }
    }, {
      path: 'merManager',
      component: _import('financeManagement/account/merManager'),
      name: 'merManagerAccount',
      meta: {
        title: '推广账户',
        keepAlive: true
      }
    }, {
      path: 'memberLuckmoneyAccount',
      component: _import('financeManagement/account/memberLuckmoney'),
      name: 'memberLuckmoneyAccount',
      meta: {
        title: '会员红包账户',
        keepAlive: true
      }
    }, {
      path: 'memberIntegral',
      component: _import('financeManagement/account/memberIntegral'),
      name: 'memberIntegral',
      meta: {
        title: '会员积分账户',
        keepAlive: true
      }
    }, {
      path: 'memberIntegralRecord',
      component: _import('financeManagement/account/memberIntegralRecord'),
      name: '',
      meta: {
        title: '',
      }
    }, {
      path: 'memberLuckmoneyRecord',
      component: _import('financeManagement/account/memberLuckmoneyRecord'),
      name: '',
      meta: {
        title: '',
      }
    }]
  }, {
    path: 'balance',
    component: _import('financeManagement/balance/index'),
    name: 'balance',
    meta: {
      title: '收支明细',
      keepAlive: true
    },
    children: [{
      path: 'shopGoods',
      component: _import('financeManagement/balance/shopGoods'),
      name: 'shopGoodsBalance',
      meta: {
        title: '企业货款收支明细',
        keepAlive: true
      }
    }, {
      path: 'storeGoods',
      component: _import('financeManagement/balance/storeGoods'),
      name: 'storeGoodsBalance',
      meta: {
        title: '商圈货款收支明细',
        keepAlive: true
      }
    }, {
      path: 'merManager',
      component: _import('financeManagement/balance/merManager'),
      name: 'merManagerBalance',
      meta: {
        title: '推广收益收支明细',
        keepAlive: true
      }
    }, {
      path: 'seller',
      component: _import('financeManagement/balance/seller'),
      name: 'sellerBalance',
      meta: {
        title: '商户收益收支明细',
        keepAlive: true
      }
    }, {
      path: 'redpackets',
      component: _import('financeManagement/balance/redpackets'),
      name: 'redpacketsBalance',
      meta: {
        title: '红包收支明细',
        keepAlive: true
      }
    }, {
      path: 'score',
      component: _import('financeManagement/balance/score'),
      name: 'scoreBalance',
      meta: {
        title: '积分收支明细',
        keepAlive: true
      }
    }]
  }, {
    path: 'withdraws',
    component: _import('financeManagement/withdraws/index'),
    name: 'withdraws',
    meta: {
      title: '提现记录',
      keepAlive: true
    },
    children: [{
      path: 'shopGoods',
      component: _import('financeManagement/withdraws/shopGoods'),
      name: 'shopGoodsWithdraws',
      meta: {
        title: '企业货款提现',
        keepAlive: true
      }
    }, {
      path: 'goods',
      component: _import('financeManagement/withdraws/storeGoods'),
      name: 'goodsWithdraws',
      meta: {
        title: '商圈货款提现',
        keepAlive: true
      }
    }, {
      path: 'spread',
      component: _import('financeManagement/withdraws/spread'),
      name: 'spreadWithdraws',
      meta: {
        title: '推广收益提现',
        keepAlive: true
      }
    }, {
      path: 'member',
      component: _import('financeManagement/withdraws/member'),
      name: 'memberWithdraws',
      meta: {
        title: '会员提现',
        keepAlive: true
      }
    }]
  }, {
    path: 'settlement',
    component: _import('financeManagement/settlement/index'),
    name: 'settlement',
    meta: {
      title: '结算单',
      keepAlive: true
    },
    children: [{
      path: 'shopGoods',
      component: _import('financeManagement/settlement/shopGoods'),
      name: 'shopGoodsSettlement',
      meta: {
        title: '企业货款结算单',
        keepAlive: true
      }
    }, {
      path: 'storeGoods',
      component: _import('financeManagement/settlement/storeGoods'),
      name: 'storeGoodsSettlement',
      meta: {
        title: '商圈货款结算单',
        keepAlive: true
      }
    }, {
      path: 'subsidy',
      component: _import('financeManagement/settlement/subsidy'),
      name: 'subsidySettlement',
      meta: {
        title: '平台补贴分账单',
        keepAlive: true
      }
    }, {
      path: 'profit',
      component: _import('financeManagement/settlement/profit'),
      name: 'profitSettlement',
      meta: {
        title: '收益分账单',
        keepAlive: true
      }
    }, {
      path: 'redpackets',
      component: _import('financeManagement/settlement/redpackets'),
      name: 'redpacketsSettlement',
      meta: {
        title: '红包分账单',
        keepAlive: true
      }
    }]
  }, {
    path: 'payoff',
    component: _import('financeManagement/payoff/index'),
    name: 'payoff',
    meta: {
      title: '支付单',
      keepAlive: true
    },
    children: [{
      path: 'record',
      component: _import('financeManagement/payoff/record'),
      name: 'payoffRecord',
      meta: {
        title: '支付单',
        keepAlive: true
      }
    }]
    // }, {
    // path: 'makeFinance',
    // component: _import('financeManagement/makeFinance/index'),
    // name: 'makeFinance',
    // meta: {
    //   title: '开票管理',
    // },
    // children: [{
    //   path: 'invoice',
    //   component: _import('financeManagement/makeFinance/invoice'),
    //   name: 'invoice',
    //   meta: {
    //     title: '开票管理(没接口)',
    //   }
    // }]
  }]
}
