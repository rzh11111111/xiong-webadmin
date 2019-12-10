/**
 * key      服务器菜单权限标识
 * router    vue路由地址
 * permission  登陆后菜单权限接口地址
 **/
// var MENU_PERMISSION=[
//   {"key":"admin:api:sys:permission","router":"","permission":{}},
//   {"key":"admin:api:sys:dep:page","router":"","permission":{}},
//   {"key":"admin:api:sys:menupermission:list","router":"","permission":{}},
//   {"key":"admin:api:sys:role:page","router":"","permission":{}},
//   {"key":"admin:api:sys:employee:page","router":"","permission":{}},
//   {"key":"admin:api:sys:dep:save","router":"","permission":{}},
//   {"key":"admin:api:sys:dep:delete","router":"","permission":{}},
//   {"key":"admin:api:sys:dep:list","router":"","permission":{}},
//   {"key":"admin:api:sys:dep:find","router":"","permission":{}},
//   {"key":"admin:api:sys:dep:enable","router":"",permission:{}},
//   {"key":"admin:api:sys:menupermission:save","router":"","permission":{}},
//   {"key":"admin:api:sys:menupermission:update:menupermission","router":"","permission":{}},
//   {"key":"admin:api:sys:menupermission:select","router":"","permission":{}},
//   {"key":"admin:api:sys:menupermission:delete","router":"","permission":{}},
//   {"key":"admin:api:sys:menupermission:enable","router":"","permission":{}},
//   {"key":"admin:api:sys:role:get","router":"","permission":{}},
//   {"key":"admin:api:sys:role:save","router":"","permission":{}},
//   {"key":"admin:api:sys:role:update","router":"","permission":{}},
//   {"key":"admin:api:sys:role:delete","router":"","permission":{}},
//   {"key":"admin:api:sys:role:list","router":"","permission":{}},
//   {"key":"admin:api:sys:employee:get","router":"","permission":{}},
//   {"key":"admin:api:sys:employee:save","router":"","permission":{}},
//   {"key":"admin:api:sys:employee:updatePassword","router":"","permission":{}},
//   {"key":"admin:api:sys:employee:delete","router":"","permission":{}},
//   {"key":"admin:api:sys:employee:enable","router":"","permission":{}},
//   {"key":"admin:api:sys:employee:find","router":"","permission":{}},
// ]
export function MENU_PERMISSION(val) {
  switch (val) {
    case "admin:api:sys:menupermission":
      return 'menuPermission'; // 菜单管理
    case "admin:api:sys:dep":
      return 'department'; // 部门管理
    case "admin:api:sys:role":
      return 'roleList'; // 角色管理
    case "admin:api:sys:employee":
      return 'staffList'; // 员工管理
    case "admin:api:st:store:account":
      return 'storeSeller'; // 线下商户账号管理
    case "admin:api:sale:goods:page:production:onsale":
      return 'proShelvesGoods' // 生产企业上架中的商品
    case "admin:api:sale:goods:page:production:downsale":
      return 'proNoShelvesGoods' // 生产企业未上架的商品
    case "admin:api:sale:goods:category:list:production":
      return 'productionCategory' // 生产企业外部展示类目
    case "admin:api:sale:goods:page:city:onsale":
      return 'cityShelvesGoods' // 同城企业上架中的商品
    case "admin:api:sale:goods:page:city:downsale":
      return 'cityNoShelvesGoods' // 同城企业未上架的商品
    case "admin:api:sale:goods:category:list:city":
      return 'cityCategory' // 同城企业外部展示类目
    case "admin:api:sale:goods:category":
      return 'goodsClassifications' // 外部类目管理
    case "admin:api:sale:goods:category:inside":
      return 'goodsClassification' // 内部类目管理
    case "admin:api:sale:brand":
      return 'goodsBrands' // 品牌管理
    case "admin:api:sale:goods:attribute":
      return 'goodsAttribute' // 属性管理
    case "admin:api:sale:goods:group":
      return 'goodsGroup' // 商品分组
    case "admin:api:st:store:category:inside":
      return 'storeClassify'; //线下店铺分类列表（内部）
    case "admin:api:st:store:category:outside":
      return 'storeClassifyOutside'; //线下店铺外部分类列表
    case "admin:api:st:store:recommend":
      return 'storeRecommend'; //店铺推荐
    case "admin:api:oa:approval:content":
      return 'approvalList'; //店铺审核任务列表
    case "admin:api:oa:approval:cash":
      return 'approvalCash'; //提现审核
    case "admin:api:oa:approval:record":
      return 'approvalRecord'; //审核记录
    case "admin:api:cs:shop:city:clue":
      return 'shopClue'; //同城企业预推广
    case "admin:api:sys:approval:config":
      return 'auditConfiguration'; //  审核配置管理
    // case "admin:api:oa:approval:store:te":
    //   return 'storeApprovalt'; //特色店铺审核任务列表
    // case "admin:api:oa:approval:shop":
    //   return 'shopApproval'; //线上店铺审核任务列表
    // case "admin:api:oa:approval:shop:tong":
    //   return 'shopApprovalt'; //同城企业审核任务列表
    // case "admin:api:oa:approval:goods":
    //   return 'goodsApproval'; //商品审核任务列表
    // case "admin:api:oa:approval:record:page":
    //   return 'approvalRecord'; //店铺审核记录
    case "admin:api:st:store:bankcard":
      return 'tiedCard'; //店铺绑卡列表
    case "admin:api:sale:goods:recommend":
      return 'goodsRecommendation' // 商品推荐
    case "admin:api:st:store:store":
      return 'storeList'; //线下店铺列表
    case "admin:api:cs:shop":
      return 'mfrs'; //生产企业管理
    case "admin:api:cs:shop:city":
      return 'cityWide'; //同城企业管理
    case "admin:api:ec:app:base:config":
      return 'appBaseConfig';//消费者APP基础设置
    case "admin:api:ec:app:version:config":
      return 'appVersion';//消费者APP版本管理
    case "admin:api:ec:hot":
      return 'hotWord'; //搜索热词
    case "admin:api:cs:shop:pro:recommend":
      return 'shopRecommend'; //商城精选商家
    case "admin:api:mo:activity:goods":
      return 'goodsActivity'; //商品活动管理
    case "admin:api:mo:activity:spread:register":
      return 'registerActivity'; //注册活动管理
    case "admin:api:mo:activity:invite:register":
      return 'inviteRegister'; //邀请注册活动管理
    case "admin:api:sm:message:sys":
      return 'systemMessage' // 系统消息
    case "admin:api:sm:notice:platform":
      return 'platformNotice'; //平台公告
    case "admin:api:sm:notice:activity":
      return 'activityNotice'; //活动通知
    case "admin:api:sys:service:config":
      return 'serviceConfig' // 业务参数
    case "admin:api:tc:member:search:goods:record":
      return 'goodsSearchRecord' // 商品搜索记录列表
    case "admin:api:tc:member:search:store:record":
      return 'sellerSearchRecord' // 商户搜索记录列表
    case "admin:api:sys:dict":
      return 'dictionary' // 系统字典
    case "admin:api:mo:ad:banner:content":
      return 'appBanner'; //广告位
    case "admin:api:sys:file:category":
      return 'fileDirectory' //  文件分类列表
    case "admin:api:tc:member:shipping:address":
      return 'memberAddress' //  会员收货地址
    case "admin:api:sys:message:template:config":
      return 'messageTemplate' //  消息模板
    case "admin:api:code:code:generator":
      return 'codeGenerator' //  编码生成器
    case "admin:api:sys:file:config":
      return 'resource';//资源管理器
    case "admin:api:sm:message:member:record":
      return 'memberMessage' //  会员消息
    case "admin:api:sys:area:config":
      return 'areaConfig' //  区域配置
    case "admin:api:sale:brand:series":
      return 'brandSeries' //  品牌系列
    case "admin:api:sm:message:shop:record":
      return 'shopMessage' //  企业消息
    case "admin:api:sm:message:store:record":
      return 'storeMessage' //  商户消息
    case "admin:api:sm:message:other:record":
      return 'otherMessage' //  其他消息
    case "admin:api:mer:manager:provinces":
      return 'provinces' //  省区总管理
    case "admin:api:mer:manager:partner":
      return 'partner' //  合作商管理
    case "admin:api:mer:manager:promoters":
      return 'promoters' //  推广员管理
    case "admin:api:st:store:bankroll:account":
      return 'storeAccount'; //线下店铺账户
    case "admin:api:cs:shop:bankroll:account":
      return 'shopAccount'; //线上店铺账户
    case "admin:api:st:store:account:bankroll":
      return 'sellerAccount'; //线下商户账户
    case "admin:api:mer:manager:bankroll:account":
      return 'merManagerAccount'; //推广账户

    // 收支明细
    case "bankroll:balance:goods:shop":
      return 'shopGoodsBalance'; //企业货款收支明细
    case "bankroll:balance:goods":
      return 'storeGoodsBalance'; //商圈货款收支明细
    case "bankroll:balance:merManager":
      return 'merManagerBalance'; //省区总、合作商、推广员收益收支明细
    case "bankroll:balance:seller":
      return 'sellerBalance'; //商户收益收支明细
    case "bankroll:balance:redpackets":
      return 'redpacketsBalance'; //红包收支明细
    case "bankroll:balance:score":
      return 'scoreBalance'; //积分收支明细
    // 提现记录
    case "bankroll:withdraws:goods":
      return 'goodsWithdraws'; //商圈货款提现
    case "bankroll:withdraws:goods:shop":
      return 'shopGoodsWithdraws'; //企业货款提现
    case "bankroll:withdraws:spread":
      return 'spreadWithdraws'; //推广员收益提现
    case "bankroll:withdraws:partner":
      return 'partnerWithdraws'; //合作商收益提现
    case "bankroll:withdraws:member":
      return 'memberWithdraws'; //会员提现
    //结算单
    case "bankroll:settlement:goods":
      return 'storeGoodsSettlement'; //店铺货款结算单
    case "bankroll:settlement:goods:subsidy":
      return 'subsidySettlement'; //平台补贴分账单
    case "bankroll:settlement:goods:shop":
      return 'shopGoodsSettlement'; //企业货款结算单
    case "bankroll:settlement:profit":
      return 'profitSettlement'; //收益分账单
    case "bankroll:settlement:redpackets":
      return 'redpacketsSettlement'; //红包分账单
    //支付单
    case "bankroll:payoff:record":
      return 'payoffRecord'; //支付单

    // case "admin:api:cs:shopbankrollaccount:page":
    //   return 'cityWideAccount'; //同城企业资金账户
    // case "admin:api:cs:shopbankrollaccount:mfrs":
    //  return 'mfrsAccount'; //生产企业资金账户
    // case "admin:api:st:store:bankroll:account:seed":
    //   return 'seedStore'; //种子店铺货款账户
    // case "admin:api:st:store:bankroll:account":
    //   return 'featureStore'; //特色店铺货款账户
    // case "admin:api:st:store:account:bankroll":
    //   return 'storeAccount'; //线下商户资金账户
    // case "admin:api:mer:manager:bankroll:account:partner":
    //   return 'partnerAccount'; //合作商资金账户
    // case "admin:api:mer:manager:bankroll:account:promoter":
    //   return 'promoterAccount'; //推广员资金账户
    // case "admin:api:mer:manager:bankroll:account:province":
    //   return 'provinceAccount'; //省区总资金账户
    case "admin:api:tc:member":
      return 'memberList' //  会员列表
    case "admin:api:tc:member:activity:record":
      return 'memberActivity' //  会员活动参与记录
    case "admin:api:tc:member:integral:account":
      return 'memberIntegral' //  会员积分账户
    // case "admin:api:tc:member:integral:account:record:page":
    //   return 'memberIntegralRecord' //  会员积分账户流水
    case "admin:api:tc:member:luckmoney:account":
      return 'memberLuckmoneyAccount' //  会员红包账户
    case "admin:api:ots:offline:order":
      return 'offlineOrderList' //线下订单列表
    case "admin:api:online:order":
      return 'onlineOrderList' //线上订单列表
    case "admin:api:oa:business:cooperate:record":
      return 'businessCooperate' //商务合作记录
    case "admin:api:oa:feed:back":
      return 'feedbackList' //意见反馈
    case "admin:api:ots:offline:order:evaluate":
      return 'orderEvaluate' //  线下订单评价
    case "admin:api:osm:online:order:evaluate:msfr":
      return 'msfrEvaluate'; //  生产企业订单评价
    case "admin:api:osm:online:order:evaluate:city":
      return 'cityEvaluate'; //  同城企业订单评价
    case "admin:api:osm:online:customer:service:order":
      return 'refundApply'; //  退款申请
    case "admin:api:tc:member:invite:record":
      return 'memberInviteRecord'; //  会员分享关系列表
    case "kaipiaoguanli":
      return 'invoice'; //  开票管理
    case "admin:api:ping:an:pay:store:sonmoney":
      return 'anPay'; //  线下店铺资金账户余额或者功能性子账户余额
  }
}
