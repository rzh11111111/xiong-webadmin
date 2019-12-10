import {axiosGet, axiosPost} from './baseApi'
import Config from '../utils/config'
import qs from 'qs'
// export const getTestList = (params,config)=>axiosGet('/getTestList',params,config);
// export const postTestList = (params,config)=>axiosPost('/sgw_system_web/sys/shop/getBaseInfo',params,config);


// mock接口
// 登录
// export const loginByUsername = (params, config) => axiosPost('/sys/login', params, config)

// 获取用户信息
export const getUserInfo = (params, config) => axiosPost('/sys/index', qs.stringify(params), config)

// // 获取菜单
// export const getMenu = (params, config) => axiosPost('/admin/menu', params, config)
//
// // 获取角色列表
// // export const getRoleList = (params, config) => axiosPost('/admin/role', params, config)
//
// // 获取菜单选项
// export const getRoleAccess = (params, config) => axiosPost('/admin/role_access', params, config)
//
//
// // 获取部门选项
// // export const getDepartment = (params, config) => axiosPost('/admin/department', params, config)
//
//
// // 用户列表获取角色
// export const getRoles = (params, config) => axiosPost('/admin/roles', params, config);
//
// // 获取供应商信息
// export const getGoodsSupplier = (params, config) => axiosPost('/admin/goodsSupplier', params, config);
//
// export const getItemDealers = (params, config) => axiosPost('/admin/ItemDealers', params, config);
//
// // 获取分类
// export const getClassification = (params, config) => axiosPost('/admin/classification', params, config);
//
// // 获取商品品牌列表
// export const getGoodsBrands = (params, config) => axiosPost('/admin/goodsBrands', params, config);

/**************************** 首页 ****************************/


// 真实接口

// 登录
export const loginByUsername = (params, config) => axiosPost('/admin/api/login/login/in', qs.stringify(params), config);
// 登出接口
export const logout = (params, config) => axiosPost('/admin/api/login/login/out', params, config);
// 上传图片
export const saveImgupload = (params, config) => axiosPost('/admin/api/sys/fileconfig/upload', params, config);
// 修改密码
export const updatePassword = (params, config) => axiosPost('/admin/api/sys/employee/updatePassword', qs.stringify(params), config);

/**************************** 用户管理 ****************************/

/*********** 菜单管理 ***********/
// 获取菜单列表信息
export const getMenuList = (params, config) => axiosPost('/admin/api/sys/menupermission/list', params, config);
// 新增菜单
export const saveMenu = (params, config) => axiosPost('/admin/api/sys/menupermission/save', params, config);
// 更新更新
export const updateMenu = (params, config) => axiosPost('/admin/api/sys/menupermission/update/menupermission', params, config);
// 删除菜单
export const deleteMenu = (params, config) => axiosPost('/admin/api/sys/menupermission/delete', qs.stringify(params), config);
// 是否禁用
export const isEnableMenu = (params, config) => axiosPost('/admin/api/sys/menupermission/enable', qs.stringify(params), config);

/*********** 角色管理 ***********/
// 获取角色列表信息
export const getRoleList = (params, config) => axiosPost('/admin/api/sys/role/page', params, config);
// 新增角色
export const saveRole = (params, config) => axiosPost('/admin/api/sys/role/save', params, config);
// 编辑角色
export const updateRole = (params, config) => axiosPost('/admin/api/sys/role/update', params, config);
// 删除角色
export const deleteRole = (params, config) => axiosPost('/admin/api/sys/role/delete', qs.stringify(params), config);
// 批量删除角色
export const deleteArrRole = (params, config) => axiosPost('/admin/api/sys/role/batchDelete', params, config);
// 添加角色和菜单权限
export const insertMenuPermissionAndRole = (params, config) => axiosPost('/admin/api/sys/role/insertMenuPermissionAndRole', params, config);
// 根据ID获取角色全部信息
export const roleAccessGet = (params, config) => axiosPost('/admin/api/sys/role/get', qs.stringify(params), config);
// 根据ID获取角色全部信息
export const roleAccessFind = (params, config) => axiosPost('/admin/api/sys/role/find', qs.stringify(params), config);
// 是否启用
export const isRoleAccessEnable = (params, config) => axiosPost('/admin/api/sys/role/enable', qs.stringify(params), config);

/*********** 部门管理 ***********/
// 获取部门列表分页
// export const getDepartment = (params, config) => axiosPost('/admin/api/sys/dep/page', qs.stringify(params), config);
// 获取部门列表不分页
export const getDepartment = (params, config) => axiosPost('/admin/api/sys/dep/list', params, config);
// 新增部门
export const saveDepartment = (params, config) => axiosPost('/admin/api/sys/dep/save', params, config);
// 删除部门
export const deleteDepartment = (params, config) => axiosPost('/admin/api/sys/dep/delete', qs.stringify(params), config);
// 是否启用
export const isEnableDepartment = (params, config) => axiosPost('/admin/api/sys/dep/enable', qs.stringify(params), config);

export const getDepStaff = (params, config) => axiosPost('/admin/api/sys/dep/find', params, config);
/*********** 员工管理 ***********/
// 获取员工列表分页
export const getStaffList = (params, config) => axiosPost('/admin/api/sys/employee/page', params, config);
// 获取员工List不分页
export const getStaff = (params, config) => axiosPost('/admin/api/sys/employee/list', params, config);
//重置密码
export const resetPwd = (params, config) => axiosPost('/admin/api/sys/employee/reset/password', params, config);
// 新增员工
export const saveStaff = (params, config) => axiosPost('/admin/api/sys/employee/save', params, config);
// 删除员工
export const deleteStaff = (params, config) => axiosPost('/admin/api/sys/employee/delete', qs.stringify(params), config);
// 批量删除员工
export const deleteArrStaff = (params, config) => axiosPost('/admin/api/sys/employee/batchDelete', params, config);
// 获取角色信息
export const getRole = (params, config) => axiosPost('/admin/api/sys/role/list', params, config);
// 获取部门信息
export const depList = (params, config) => axiosPost('/admin/api/sys/dep/list', params, config);
// 获取员工信息
export const findDep = (params, config) => axiosPost('/admin/api/sys/employee/find', qs.stringify(params), config);
// 获取当前员工登录信息
export const getEmployee = (params, config) => axiosPost('/admin/api/sys/employee/get/login/employee', qs.stringify(params), config);
// 是否启用
export const isEmployeeEnable = (params, config) => axiosPost('/admin/api/sys/employee/enable', qs.stringify(params), config);

/*********** 省区总管理 ***********/
// 获取省区总列表分页
export const getProvincesList = (params, config) => axiosPost('/admin/api/mer/manager/boss/page', params, config);
// 获取省区总列表不分页
export const getProvinces = (params, config) => axiosPost('/admin/api/mer/manager/region/boos/page', params, config);
// 新增省区总
export const saveProvinces = (params, config) => axiosPost('/admin/api/mer/manager/save/region/boss', params, config);
// 修改省区总
export const updateProvinces = (params, config) => axiosPost('/admin/api/mer/manager/update/region/boss', params, config);
// 删除
export const delProvinces = (params, config) => axiosPost('/admin/api/mer/manager/delete/region/boss', qs.stringify(params), config);
// 获取省区总详情
export const findProvinces= (params, config) => axiosPost('/admin/api/mer/manager/find/region/boss', qs.stringify(params), config);
// 获取合作商下辖 推广员，商户，企业数量
export const getProvincesCount = (params, config) => axiosPost('/admin/api/mer/manager/count/by/regionBoss', params, config);
// 查询市场人员被占领辖区
export const getSeizedArea = (params, config) => axiosPost('/admin/api/mer/manager/find/manager/seized/dutyArea', params, config);
// 查询市场人员被占领辖区（不包括自己占领的辖区）
export const getDisabledArea = (params, config) => axiosPost('/admin/api/mer/manager/find/manager/seized/dutyArea/no/myself', params, config);

// 根据code业务参数详情（抽成）
export const findServiceRate= (params, config) => axiosPost('/admin/api/sys/service/config/get/by/code', qs.stringify(params), config);

// 启用禁用
export const enableMer = (params, config) => axiosPost('/admin/api/mer/manager/enable', qs.stringify(params), config);
//根据市场人员获取卡信息
export const getMerCard = (params, config) => axiosPost('/admin/api/mer/manager/bank/card/select/by/merManager', params, config);
//根据区域id查看辖区
export const getDutyById = (params, config) => axiosPost('/admin/api/mer/manager/duty/areaConfig/find/duty/by/areaIds', params, config);

// 获取所属辖区列表不分页
export const getDutyAreaList = (params, config) => axiosPost('/admin/api/mer/manager/find/manager/dutyArea', params, config);
//根据辖区id获取省区总
export const getDutyAreaProvince = (params, config) => axiosPost('/admin/api/mer/manager/duty/areaConfig/find/region/boss', params, config);

//修改账号状态
export const statusMer = (params, config) => axiosPost('/admin/api/mer/manager/update/status', params, config);
/*********** 推广员管理 ***********/
// 获取推广员列表分页
export const getPromotersList = (params, config) => axiosPost('/admin/api/mer/manager/spread/page', params, config);
// 获取推广员详情
export const findPromoters = (params, config) => axiosPost('/admin/api/mer/manager/find/spread', qs.stringify(params), config);
// 统计推广店铺，企业数量
export const getPromotersCount = (params, config) => axiosPost('/admin/api/mer/manager/count/by/spread', params, config);

/*********** 合作商管理 ***********/
// 获取合作商列表分页
export const getPartnerList = (params, config) => axiosPost('/admin/api/mer/manager/cooperation/page', params, config);
// 获取合作商详情
export const findCooperatio = (params, config) => axiosPost('/admin/api/mer/manager/find/cooperation', qs.stringify(params), config);
// 获取合作商下辖 推广员，商户，企业数量
export const getCooperationCount = (params, config) => axiosPost('/admin/api/mer/manager/count/by/cooperation', params, config);
//启用禁用
// export const enablePartner = (params, config) => axiosPost('/admin/api/mer/manager/enable', qs.stringify(params), config);
//status
// export const statusPartner = (params, config) => axiosPost('/admin/api/mer/manager/status', qs.stringify(params), config);
//根据辖区id获取合作商
export const getDutyAreaPartner = (params, config) => axiosPost('/admin/api/mer/manager/duty/areaConfig/find/coperation', params, config);

/**************************** 商品管理 ****************************/

/*********** 商品列表 ***********/
export const getGoodsList = (params, config) => axiosPost('/admin/api/sale/goods/page', params, config);
// 获取上架中商品列表分页(生产企业)
export const getGoodsProductionOnsaleList = (params, config) => axiosPost('/admin/api/sale/goods/page/production/onsale', params, config);
// 获取未上架商品列表分页(生产企业)
export const getGoodsProductionDownsaleList = (params, config) => axiosPost('/admin/api/sale/goods/page/production/downsale', params, config);
// 获取上架中商品列表分页(同城企业)
export const getGoodsCityOnsaleList = (params, config) => axiosPost('/admin/api/sale/goods/page/city/onsale', params, config);
// 获取未上架商品列表分页(同城企业)
export const getGoodsCityDownsaleList = (params, config) => axiosPost('/admin/api/sale/goods/page/city/downsale', params, config);
// 获取商品列表不分页
export const getGoodsNoPage = (params, config) => axiosPost('/admin/api/sale/goods/list', params, config);
// 添加商品
export const saveGoods = (params, config) => axiosPost('/admin/api/sale/goods/save', params, config);
// 修改商品
export const updateGoods = (params, config) => axiosPost('/admin/api/sale/goods/update', params, config);
// 删除商品
export const deleteGoods = (params, config) => axiosPost('/admin/api/sale/goods/delete', qs.stringify(params), config);
// 获取商品详情
export const getGoodsDetails = (params, config) => axiosPost('/admin/api/sale/goods/get', params, config);
// 获取商品关联表
export const getGoodsDetailsFind = (params, config) => axiosPost('/admin/api/sale/goods/find', qs.stringify(params), config);
// 商品上下架
export const goodsEnable = (params, config) => axiosPost('/admin/api/sale/goods/enable', qs.stringify(params), config);

/*********** 商品内部分类 ***********/
// 获取类目列表分页
// export const getGoodsClassificationList = (params, config) => axiosPost('/admin/api/sale/goods/category/page', params, config);
// 获取类目列表不分页
export const getGoodsClassificationList = (params, config) => axiosPost('/admin/api/sale/goods/category/inside/list', params, config);
// 新增类目
export const saveGoodsClassification = (params, config) => axiosPost('/admin/api/sale/goods/category/inside/save', params, config);
// 删除类目
export const delGoodsClassification = (params, config) => axiosPost('/admin/api/sale/goods/category/inside/delete', qs.stringify(params), config);
// 根据ID查类目信息
export const findGoodsClassification = (params, config) => axiosPost('/admin/api/sale/goods/category/inside/find', qs.stringify(params), config);
// 是否启用外部类目
export const isEnableGoodsClassification = (params, config) => axiosPost('/admin/api/sale/goods/category/inside/enable', qs.stringify(params), config);

/*********** 商品外部分类 ***********/
// 获取生产企业类目列表不分页
export const getProductionGoodsClassificationLists = (params, config) => axiosPost('/admin/api/sale/goods/category/list/production', params, config);
// 获取同城企业类目列表不分页
export const getCityGoodsClassificationLists = (params, config) => axiosPost('/admin/api/sale/goods/category/list/city', params, config);
// 新增类目（生产企业）
export const saveProductionGoodsClassifications = (params, config) => axiosPost('/admin/api/sale/goods/category/save/production', params, config);
// 新增类目（同城企业）
export const saveCityGoodsClassifications = (params, config) => axiosPost('/admin/api/sale/goods/category/save/city', params, config);
// 删除类目
export const delGoodsClassifications = (params, config) => axiosPost('/admin/api/sale/goods/category/delete', qs.stringify(params), config);
// 根据ID查类目信息
export const findGoodsClassifications = (params, config) => axiosPost('/admin/api/sale/goods/category/find', qs.stringify(params), config);
// 是否启用外部类目
export const isEnableGoodsClassifications = (params, config) => axiosPost('/admin/api/sale/goods/category/enable', qs.stringify(params), config);
// 是否推荐首页
export const isTopGoodsClassifications = (params, config) => axiosPost('/admin/api/sale/goods/category/top', qs.stringify(params), config);

/*********** 商品推荐 ***********/
// 列表（分页）接口
export const getGoodsRecommendList = (params, config) => axiosPost('/admin/api/sale/goods/recommend/page', params, config);
// 列表（不分页）接口
export const getGoodsRecommend = (params, config) => axiosPost('/admin/api/sale/goods/recommend/list', params, config);
// 新增商品推荐
export const saveGoodsRecommend = (params, config) => axiosPost('/admin/api/sale/goods/recommend/save', params, config);
// 更新商品推荐
export const updateGoodsRecommend = (params, config) => axiosPost('/admin/api/sale/goods/recommend/update', params, config);
// 商品推荐详情
export const getGoodsRecommendDetail = (params, config) => axiosPost('/admin/api/sale/goods/recommend/get', qs.stringify(params), config);
// 批量新增
export const saveGoodsRecommendBatch = (params, config) => axiosPost('/admin/api/sale/goods/recommend/save/batch', params, config);
// 批量删除
export const deleteGoodsRecommendBatch = (params, config) => axiosPost('/admin/api/sale/goods/recommend/delete/batch', qs.stringify(params), config);
// 删除
export const deleteGoodsRecommend = (params, config) => axiosPost('/admin/api/sale/goods/recommend/delete', qs.stringify(params), config);
// 根据ID查询所有关联
export const findGoodsRecommend = (params, config) => axiosPost('/admin/api/sale/goods/recommend/find', qs.stringify(params), config);

/*********** 品牌管理 ***********/
// 获取品牌列表
export const getGoodsBrandlist = (params, config) => axiosPost('/admin/api/sale/brand/page', params, config);
// 获取品牌不分页
export const getGoodsBrand = (params, config) => axiosPost('/admin/api/sale/brand/list', params, config);
// 新增品牌
export const saveGoodsBrand = (params, config) => axiosPost('/admin/api/sale/brand/save', params, config);
// 修改品牌
export const updateGoodsBrand = (params, config) => axiosPost('/admin/api/sale/brand/update', params, config);
// 删除品牌
export const delGoodsBrand = (params, config) => axiosPost('/admin/api/sale/brand/delete', qs.stringify(params), config);
// 启用停用
export const isEnableGoodsBrand = (params, config) => axiosPost('/admin/api/sale/brand/enable', qs.stringify(params), config);
// 推荐
export const isTopGoodsBrand = (params, config) => axiosPost('/admin/api/sale/brand/top', qs.stringify(params), config);
// 根据ID查询品牌信息
export const getGoodsBrandFind = (params, config) => axiosPost('/admin/api/sale/brand/find', qs.stringify(params), config);

/*********** 商品分组 ***********/
// 获取商品分组列表
export const getGoodsGroup = (params, config) => axiosPost('/admin/api/sale/goods/group/page', params, config);
// 获取商品分组不分页
export const getGoodsGroupList = (params, config) => axiosPost('/admin/api/sale/goods/group/list', params, config);
// 新增商品分组
export const saveGoodsGroup = (params, config) => axiosPost('/admin/api/sale/goods/group/save', params, config);
// 修改商品分组
export const updateGoodsGroup = (params, config) => axiosPost('/admin/api/sale/goods/group/update', params, config);
// 删除商品分组
export const delGoodsGroup = (params, config) => axiosPost('/admin/api/sale/goods/group/delete', qs.stringify(params), config);
// 商品加入分组
export const saveGoodsCreateGroup = (params, config) => axiosPost('/admin/api/sale/goods/group/create/goods/group', params, config);
// 批量删除分组中的商品
export const deleteGoodsDeleteGroup = (params, config) => axiosPost('/admin/api/sale/goods/group/delete/goods/group', params, config);
// 根据ID查询分组信息
export const getGoodsGroupFind = (params, config) => axiosPost('/admin/api/sale/goods/group/find', qs.stringify(params), config);

/*********** 品牌系列 ***********/
// 获取品牌系列列表分页
export const getBrandSeriesList = (params, config) => axiosPost('/admin/api/sale/brand/series/page', params, config);
// 获取品牌系列列表不分页
export const getBrandSeries = (params, config) => axiosPost('/admin/api/sale/goods/series/list', params, config);
// 新增或修改
export const saveBrandSeries = (params, config) => axiosPost('/admin/api/sale/brand/series/save', params, config);
// 删除
export const delBrandSeries = (params, config) => axiosPost('/admin/api/sale/brand/series/delete', qs.stringify(params), config);

/*********** 商品属性 ***********/
// 获取属性列表
export const getGoodsattribute = (params, config) => axiosPost('/admin/api/sale/goods/attribute/page', params, config);
// 新增属性
export const saveGoodsattribute = (params, config) => axiosPost('/admin/api/sale/goods/attribute/save', params, config);
// 修改属性
export const updateGoodsattribute = (params, config) => axiosPost('/admin/api/sale/goods/attribute/update', params, config);
// 删除属性
export const delGoodsattribute = (params, config) => axiosPost('/admin/api/sale/goods/attribute/delete', qs.stringify(params), config);
// 删除属性值
export const delGoodsattributeVal = (params, config) => axiosPost('/admin/api/sale/goods/attribute/delete/val', qs.stringify(params), config);
// 根据ID查询分组信息
export const findGoodsattribute = (params, config) => axiosPost('/admin/api/sale/goods/attribute/find', qs.stringify(params), config);

/*********** 商品搜索记录 ***********/
// 获取商品搜索记录列表
export const getGoodsSearchRecord = (params, config) => axiosPost('/admin/api/tc/member/search/goods/record/page', params, config);

/*********** 商户搜索记录 ***********/
// 获取商户搜索记录列表
export const getSellerSearchRecord = (params, config) => axiosPost('/admin/api/tc/member/search/store/record/page', params, config);

/**************************** 系统管理 ****************************/

/*********** 区域配置 ***********/
// 获取区域配置列表
export const getAreaConfig = (params, config) => axiosPost('/admin/api/sys/area/config/page', params, config);
// 获取区域配置列表(不分页)
export const AreaList = (params, config) => axiosPost('/admin/api/sys/area/config/list', params, config);
//获取区域配置详情
export const getAreaConfigDetail = (params, config) => axiosPost('/admin/api/sys/area/config/get', qs.stringify(params), config);
//添加区域配置
export const addAreaConfig = (params, config) => axiosPost('/admin/api/sys/area/config/save', params, config);
//修改区域配置
export const editAreaConfig = (params, config) => axiosPost('/admin/api/sys/area/config/update', params, config);
//删除区域配置
export const deleteAreaConfig = (params, config) => axiosPost('/admin/api/sys/area/config/delete', qs.stringify(params), config);


/*********** App版本管理 **********/
//列表
export const getAppVersions = (params, config) => axiosPost('/admin/api/ec/app/version/config/page', params, config);
//添加
export const addAppVersion = (params, config) => axiosPost('/admin/api/ec/app/version/config/save', params, config);
//修改
export const editAppVersion = (params, config) => axiosPost('/admin/api/ec/app/version/config/update', params, config);
//发布
export const releaseAppVersion = (params, config) => axiosPost('/admin/api/ec/app/version/config/release', params, config);
//删除
export const delAppVersion = (params, config) => axiosPost('/admin/api/ec/app/version/config/delete', qs.stringify(params), config);
//ios查询当前版本信息
export const getIOSAppVersion = (params, config) => axiosPost('/admin/api/sys/service/config/ios/version', params, config);
//修改当前版本信息 ios
export const changeIOSAppVersion = (params, config) => axiosPost('/admin/api/sys/service/config/update/version', params, config);

/*********** 系统消息 ***********/
// 获取系统消息列表
export const getMessage = (params, config) => axiosPost('/admin/api/sm/message/page', params, config);
// 获取系统消息列表
export const getMessageList = (params, config) => axiosPost('/admin/api/sm/message/list', params, config);
//获取系统消息详情
export const getMessageDetail = (params, config) => axiosPost('/admin/api/sm/message/get', qs.stringify(params), config);
//添加系统消息
export const addMessage = (params, config) => axiosPost('/admin/api/sm/message/save', params, config);
//修改系统消息
export const editMessage = (params, config) => axiosPost('/admin/api/sm/message/update', params, config);
//删除系统消息
export const deleteMessage = (params, config) => axiosPost('/admin/api/sm/message/delete', qs.stringify(params), config);

/*********** 平台消息 ***********/
// 获取平台消息列表
export const getPlatformMsg = (params, config) => axiosPost('/admin/api/sm/notice/page', params, config);
//获取平台消息详情
export const getPlatformMsgInfo = (params, config) => axiosPost('/admin/api/sm/notice/get', qs.stringify(params), config);
//获取平台消息详情
export const getPlatformMsgDetails = (params, config) => axiosPost('/admin/api/sm/notice/find', qs.stringify(params), config);
//添加平台消息
export const addPlatformMsg = (params, config) => axiosPost('/admin/api/sm/notice/create/notice', params, config);
//修改平台消息
export const editPlatformMsg = (params, config) => axiosPost('/admin/api/sm/notice/update/notice', params, config);
//删除平台消息
export const delPlatformMsg = (params, config) => axiosPost('/admin/api/sm/notice/delete', qs.stringify(params), config);
//置顶平台消息
export const topPlatformMsg = (params, config) => axiosPost('/admin/api/sm/notice/top', qs.stringify(params), config);
//开启关闭平台消息
export const enablePlatformMsg = (params, config) => axiosPost('/admin/api/sm/notice/enable', qs.stringify(params), config);
//平台公告是否为全平台
// export const allPlatformMsg = (params, config) => axiosPost('/admin/api/sm/notice/platform', params, config);

/*********** 企业消息 ***********/
// 获取消息列表
export const getShopMessage = (params, config) => axiosPost('/admin/api/sm/message/shop/record/page', params, config);
// 获取消息详情
export const getShopMessageDetail = (params, config) => axiosPost('/admin/api/sm/message/shop/record/get', qs.stringify(params), config);
// 新增消息
export const saveShopMessage = (params, config) => axiosPost('/admin/api/sm/message/shop/record/save', params, config);
// 新增群发消息
export const saveBatchShopMessage = (params, config) => axiosPost('/admin/api/sm/message/shop/record/sending', params, config);
// 标记已读
export const readShopMessage = (params, config) => axiosPost('/admin/api/sm/message/shop/record/read', qs.stringify(params), config);

/*********** 商户消息 ***********/
// 获取消息列表
export const getStoreMessage = (params, config) => axiosPost('/admin/api/sm/message/store/record/page', params, config);
// 获取消息详情
export const getStoreMessageDetail = (params, config) => axiosPost('/admin/api/sm/message/store/record/get', qs.stringify(params), config);
// 新增消息
export const saveStoreMessage = (params, config) => axiosPost('/admin/api/sm/message/store/record/save', params, config);
// 新增群发消息
export const saveBatchStoreMessage = (params, config) => axiosPost('/admin/api/sm/message/store/record/sending', params, config);
// 标记已读
export const readStoreMessage = (params, config) => axiosPost('/admin/api/sm/message/store/record/read', qs.stringify(params), config);

/*********** 其他消息 ***********/
// 获取消息列表
export const getOtherMessage = (params, config) => axiosPost('/admin/api/sm/message/other/record/page', params, config);
// 获取消息详情
export const getOtherMessageDetail = (params, config) => axiosPost('/admin/api/sm/message/other/record/get', qs.stringify(params), config);
// 新增消息
export const saveOtherMessage = (params, config) => axiosPost('/admin/api/sm/message/other/record/save', params, config);
// 新增群发消息
export const saveBatchOtherMessage = (params, config) => axiosPost('/admin/api/sm/message/other/record/sending', params, config);
// 标记已读
export const readOtherMessage = (params, config) => axiosPost('/admin/api/sm/message/other/record/read', qs.stringify(params), config);


/*********** 消息模板 ***********/
// 获取消息模板列表
export const getMessageTemplate = (params, config) => axiosPost('/admin/api/sys/message/template/config/page', params, config);

// 获取消息模板列表 不分页
export const getMessageTemplateList = (params, config) => axiosPost('/admin/api/sys/message/template/config/list', params, config);
//获取消息模板详情
export const getMessageTemplateDetail = (params, config) => axiosPost('/admin/api/sys/message/template/config/get', qs.stringify(params), config);
//添加消息模板
export const addMessageTemplate = (params, config) => axiosPost('/admin/api/sys/message/template/config/save', params, config);
//修改消息模板
export const editMessageTemplate = (params, config) => axiosPost('/admin/api/sys/message/template/config/update', params, config);
//删除消息模板
export const deleteMessageTemplate = (params, config) => axiosPost('/admin/api/sys/message/template/config/delete', qs.stringify(params), config);


/*********** 编码生成器 ***********/
// 获取编码列表
export const getCodeGenerator = (params, config) => axiosPost('/admin/api/code/code/generator/page', params, config);
//获取字典详情
export const getCodeGeneratorDetail = (params, config) => axiosPost('/admin/api/code/code/generator/get', qs.stringify(params), config);
//添加编码
export const addCodeGenerator = (params, config) => axiosPost('/admin/api/code/code/generator/save', params, config);
//修改编码
export const editCodeGenerator = (params, config) => axiosPost('/admin/api/code/code/generator/update', params, config);
//删除编码
export const deleteCodeGenerator = (params, config) => axiosPost('/admin/api/code/code/generator/delete', qs.stringify(params), config);

/*********** 字典管理 ***********/
// 获取字典列表
export const getDict = (params, config) => axiosPost('/admin/api/sys/dict/page', params, config);
//获取字典详情
export const getDictDetail = (params, config) => axiosPost('/admin/api/sys/dict/get', qs.stringify(params), config);
//添加字典
export const addDict = (params, config) => axiosPost('/admin/api/sys/dict/save', params, config);
//修改字典
export const editDict = (params, config) => axiosPost('/admin/api/sys/dict/update', params, config);
//删除字典
export const deleteDict = (params, config) => axiosPost('/admin/api/sys/dict/delete', qs.stringify(params), config);

/*********** 系统业务参数配置 ***********/
// 获取参数列表
export const getServiceConfig = (params, config) => axiosPost('/admin/api/sys/service/config/page', params, config);
// 获取参数列表不分页
export const getServiceConfigList = (params, config) => axiosPost('/admin/api/sys/service/config/list', params, config);
// 获取参数详情
export const getServiceConfigDetail = (params, config) => axiosPost('/admin/api/sys/service/config/get', qs.stringify(params), config);
// 新增参数
export const saveServiceConfig = (params, config) => axiosPost('/admin/api/sys/service/config/save', params, config);
// 编辑角色
export const updateServiceConfig = (params, config) => axiosPost('/admin/api/sys/service/config/update', params, config);
// 删除参数
export const deleteServiceConfig = (params, config) => axiosPost('/admin/api/sys/service/config/delete', qs.stringify(params), config);

/************************** 消费者App设置 **************************/

/*********** 消费者App基础设置 ***********/
// 获取列表
export const getAppBaseConfig = (params, config) => axiosPost('/admin/api/ec/app/base/config/page', params, config);
// 获取详情
export const getAppBaseConfigInfo = (params, config) => axiosPost('/admin/api/ec/app/base/config/find', qs.stringify(params), config);
// 新增参数
export const addAppBaseConfig = (params, config) => axiosPost('/admin/api/ec/app/base/config/save', params, config);
// 编辑角色
export const editAppBaseConfig = (params, config) => axiosPost('/admin/api/ec/app/base/config/update', params, config);
// 删除参数
export const delAppBaseConfig = (params, config) => axiosPost('/admin/api/ec/app/base/config/delete', qs.stringify(params), config);

/*********** 热词 ***********/
// 获取列表
export const getHotWord = (params, config) => axiosPost('/admin/api/ec/app/search/hot/page', params, config);
// 停用启用
export const enableHotWord = (params, config) => axiosPost('/admin/api/ec/app/search/hot/enable', qs.stringify(params), config);
// 新增
export const addHotWord = (params, config) => axiosPost('/admin/api/ec/app/search/hot/create', params, config);
// 编辑
export const editHotWord = (params, config) => axiosPost('/admin/api/ec/app/search/hot/update', params, config);
// 删除
export const delHotWord = (params, config) => axiosPost('/admin/api/ec/app/search/hot/delete', qs.stringify(params), config);

/*********** 生产企业推荐 ***********/
// 获取列表
export const getShopRecommend = (params, config) => axiosPost('/admin/api/cs/shop/pro/recommend/page', params, config);
// 获取详情
export const findShopRecommend = (params, config) => axiosPost('/admin/api/cs/shop/pro/recommend/find', qs.stringify(params), config);
// 新增参数
export const addShopRecommend = (params, config) => axiosPost('/admin/api/cs/shop/pro/recommend/save', params, config);
// 编辑角色
export const editShopRecommend = (params, config) => axiosPost('/admin/api/cs/shop/pro/recommend/update', params, config);
// 删除参数
export const delShopRecommend = (params, config) => axiosPost('/admin/api/cs/shop/pro/recommend/delete', qs.stringify(params), config);

/*********** App广告位 **********/
//获取广告位列表
export const getBannerList = (params, config) => axiosPost('/admin/api/mo/ad/banner/content/page', params, config);
//获取广告位详情
export const getBannerInfo = (params, config) => axiosPost('/admin/api/mo/ad/banner/content/find', qs.stringify(params), config);
//添加广告位
export const addBanner = (params, config) => axiosPost('/admin/api/mo/ad/banner/content/save', params, config);
//修改广告位
export const editBanner = (params, config) => axiosPost('/admin/api/mo/ad/banner/content/update', params, config);
//删除广告位
export const delBanner = (params, config) => axiosPost('/admin/api/mo/ad/banner/content/delete', qs.stringify(params), config);
//启用禁用广告位
export const enableBanner = (params, config) => axiosPost('/admin/api/mo/ad/banner/content/enable', qs.stringify(params), config);

/*********** 活动配置 ***********/
//列表
export const getActivityList = (params, config) => axiosPost('/admin/api/mo/activity/page', params, config);
//添加
export const addActivity = (params, config) => axiosPost('/admin/api/mo/activity/save', params, config);
//修改
export const editActivity = (params, config) => axiosPost('/admin/api/mo/activity/update', params, config);
//删除
export const delActivity = (params, config) => axiosPost('/admin/api/mo/activity/delete', params, config);
//停用启用
export const enableActivity = (params, config) => axiosPost('/admin/api/mo/activity/enable', qs.stringify(params), config);
//是否推荐
export const topActivity = (params, config) => axiosPost('/admin/api/mo/activity/top', qs.stringify(params), config);
//详情
export const getActivityInfo = (params, config) => axiosPost('/admin/api/mo/activity/find', params, config);

/*********** 注册活动配置 ***********/
//列表
export const getRegActivity = (params, config) => axiosPost('/admin/api/mo/activity/spread/register/find', params, config);
//保存
export const saveRegActivity = (params, config) => axiosPost('/admin/api/mo/activity/spread/register/save', params, config);

/*********** 邀请注册活动配置 ***********/
//列表
export const getInviteRegActivity = (params, config) => axiosPost('/admin/api/mo/activity/invite/register/find', params, config);
//保存
export const saveInviteRegActivity = (params, config) => axiosPost('/admin/api/mo/activity/invite/register/save', params, config);

/*********** 文件目录 ***********/
// 获取文件列表不分页
export const getFileDirectoryList = (params, config) => axiosPost('/admin/api/sys/file/category/list', params, config);
// 文件新增
export const saveFileDirectory = (params, config) => axiosPost('/admin/api/sys/file/category/add/file/category', params, config);
// 文件更新
export const editFileDirectory = (params, config) => axiosPost('/admin/api/sys/file/category/update/filecategory', params, config);
// 根据ID删除除文件
export const delFileDirectory = (params, config) => axiosPost('/admin/api/sys/fileconfig/delete', params, config);
// 根据id查询文件分类信息
export const selectDirectory = (params, config) => axiosPost('/admin/api/sys/menupermission/select', params, config);

/********* 资源管理器 ***********/

//列表分页
export const getResourcePage = (params, config) => axiosPost('/admin/api/sys/file/config/page', params, config);
//列表不分页
export const getResourceList = (params, config) => axiosPost('/admin/api/sys/file/config/list', params, config);
//详情
export const getResourceInfo = (params, config) => axiosPost('/admin/api/sys/file/config/select', qs.stringify(params), config);
//删除
export const delResource = (params, config) => axiosPost('/admin/api/sys/file/config/delete', qs.stringify(params), config);
// 上传
export const uploadResource = (params, config) => axiosPost('/admin/api/sys/file/config/upload', params, config);
// 上传图片
export const baseUploadResource = (params, config) => axiosPost('/admin/api/sys/file/config/base/upload', params, config);

/**************************** 商户管理 ****************************/
//修改费率
export const updateRate = (params, config) => axiosPost('/admin/api/sys/rate/config/store/update', params, config);

/*********** 商户列表 ***********/
// 获取商户列表
export const getSellerList = (params, config) => axiosPost('/admin/api/st/store/account/page', params, config);
// 获取商户详情
// export const getSellerInfo = (params, config) => axiosPost('/admin/api/st/store/get', qs.stringify(params), config);
//开启或关闭商户 禁用启用其下店铺
export const enableSeller = (params, config) => axiosPost('/admin/api/st/store/account/enable', params, config);
//商户状态
// export const statusSeller = (params, config) => axiosPost('/admin/api/st/store/platformstatus', qs.stringify(params), config);
//获取商户详情
export const getSellerDetails = (params, config) => axiosPost('/admin/api/st/store/account/accountdetails', qs.stringify(params), config);
//查询商户下面所有的责任区
export const getSellerDutyareas = (params, config) => axiosPost('/admin/api/st/store/account/getaccount/dutyareas', params, config);


/**************************** 线上商户管理 ****************************/

/*********** 商户列表 ***********/
//线上商户不分页
export const getOnlineSellerList = (params, config) => axiosPost('/admin/api/cs/shop/list', params, config);
// //获取商户列表
// export const getSellerList = (params, config) => axiosPost('/admin/api/st/store/account/page', params, config);
// //获取商户列表不分页
// export const getSellerListAll = (params, config) => axiosPost('/admin/api/st/store/account/list', params, config);
// //获取商户基本信息
// export const getSellerInfo = (params, config) => axiosPost('/admin/api/st/store/account/get', params, config);

/**************************** 企业管理 ****************************/
//创建企业
export const addShop = (params, config) => axiosPost('/admin/api/cs/shop/pro/add', params, config);
//企业列表
export const getShopPage = (params, config) => axiosPost('/admin/api/cs/shop/page', params, config);
//企业详情
export const getShopInfo = (params, config) => axiosPost('/admin/api/cs/shop/select', qs.stringify(params), config);
//企业开启关闭
export const enableShop = (params, config) => axiosPost('/admin/api/cs/shop/enable', qs.stringify(params), config);
//修改企业状态
export const statusShop = (params, config) => axiosPost('/admin/api/cs/shop/update/status', params, config);
//按上级查找同城企业
export const getShopMerPage = (params, config) => axiosPost('/admin/api/cs/shop/manager/shop/page', params, config);

/**************************** 店铺管理 ****************************/

/*********** 店铺列表 ***********/
// 获取店铺列表
export const getStoreList = (params, config) => axiosPost('/admin/api/st/store/page', params, config);
// 获取店铺详情
export const getStoreInfo = (params, config) => axiosPost('/admin/api/st/store/get', qs.stringify(params), config);
//开启或关闭店铺
export const enableStore = (params, config) => axiosPost('admin/api/st/store/isenable', qs.stringify(params), config);
//店铺状态
export const statusStore = (params, config) => axiosPost('/admin/api/st/store/platformstatus', qs.stringify(params), config);
//获取店铺详情
export const getStoreDetails = (params, config) => axiosPost('/admin/api/st/store/storedetails', qs.stringify(params), config);

/*********** 店铺内部分类管理 ***********/
//线下店铺分类（内部）
export const getStoreCateInside = (params, config) => axiosPost('/admin/api/st/store/category/inside/list', params, config);
//线下店铺分类（内部）
export const getStoreCateInsidePage = (params, config) => axiosPost('/admin/api/st/store/category/inside/page', params, config);

// 新增或修改店铺分类
export const saveStoreCateInside = (params, config) => axiosPost('/admin/api/st/store/category/inside/save', params, config);
// 删除店铺
export const delStoreCateInside = (params, config) => axiosPost('/admin/api/st/store/category/inside/delete', qs.stringify(params), config);
//启用禁用店铺分类
export const enableStoreCateInside = (params, config) => axiosPost('/admin/api/st/store/category/inside/enable', qs.stringify(params), config);

/*********** 店铺外部分类管理 ***********/
//线下店铺分类
export const getStoreCate = (params, config) => axiosPost('/admin/api/st/store/category/list', params, config);
// 新增或修改店铺分类
export const saveStoreCate = (params, config) => axiosPost('/admin/api/st/store/category/save', params, config);
// 店铺分类详情
export const getStoreCateInfo = (params, config) => axiosPost('/admin/api/st/store/category/find', qs.stringify(params), config);
// 删除店铺
export const deleteStoreCate = (params, config) => axiosPost('/admin/api/st/store/category/delete', qs.stringify(params), config);
//启用禁用店铺分类
export const enableStoreCate = (params, config) => axiosPost('/admin/api/st/store/category/enable', qs.stringify(params), config);

/*********** 店铺推荐 ***********/
//店铺推荐列表
export const getStoreRecommendList = (params, config) => axiosPost('/admin/api/st/store/recommend/page', params, config);
//新增或修改店铺推荐
export const saveStoreRecommend = (params, config) => axiosPost('/admin/api/st/store/recommend/save', params, config);
//删除店铺推荐
export const deleteStoreRecommend = (params, config) => axiosPost('/admin/api/st/store/recommend/delete', qs.stringify(params), config);
//获取店铺推详情
export const getStoreRecommend = (params, config) => axiosPost('/admin/api/st/store/recommend/get', qs.stringify(params), config);

//批量新增或修改店铺推荐
export const saveStoreRecommendBatch = (params, config) => axiosPost('/admin/api/st/store/recommend/save/batch', params, config);

/*********** 店铺绑卡列表 ***********/
//获取店铺绑卡列表
export const getBankcardList = (params, config) => axiosPost('/admin/api/st/store/bankcard/page', params, config);
//获取店铺绑卡详情
export const getBankcard = (params, config) => axiosPost('/admin/api/st/store/bankcard/get', params, config);

/**************************** 售后管理 ****************************/

/*********** 线下订单评价管理 ***********/
//获取列表
export const getOrderEvaluatePage = (params, config) => axiosPost('/admin/api/ots/offline/order/evaluate/record/page', params, config);
//获取详情
export const getOrderEvaluateInfo = (params, config) => axiosPost('/admin/api/ots/offline/order/evaluate/record/find', params, config);
//修改评价状态
export const editOrderEvaluateStatus = (params, config) => axiosPost('/admin/api/ots/offline/order/evaluate/record/update/status', params, config);
// 评价显示隐藏
export const showOrderEvaluate = (params, config) => axiosPost('/admin/api/ots/offline/order/evaluate/record/update/isShow', qs.stringify(params), config);


/*********** 生产/同城企业评价管理 ***********/
//获取列表
export const getShopEvaluatePage = (params, config) => axiosPost('/admin/api/osm/online/order/evaluate/record/page', params, config);
//修改评价状态
export const editShopEvaluateStatus = (params, config) => axiosPost('/admin/api/osm/online/order/evaluate/record/update/status', params, config);

// 评价显示隐藏
export const showShopEvaluate = (params, config) => axiosPost('/admin/api/osm/online/order/evaluate/record/update/isShow', qs.stringify(params), config);


/**************************** 财务管理 ****************************/

/*********** 货款提现 ***********/
//获取列表
export const getGoodsWithdrawsPage = (params, config) => axiosPost('/admin/api/ps/extract/goods/order/page', params, config);
//是否同意提现
export const agreeGoodsWithdraw = (params, config) => axiosPost('/admin/api/ps/extract/goods/order/approve/ornot', params, config);
//打款是否成功
export const paymentGoodsWithdraw = (params, config) => axiosPost('/admin/api/ps/extract/goods/order/payment/success/ornot', params, config);

/*********** 推广提现 ***********/
//获取列表
export const getSpreadWithdrawsPage = (params, config) => axiosPost('/admin/api/ps/extract/brokerage/order/page', params, config);
//是否同意提现
export const agreeSpreadWithdraw = (params, config) => axiosPost('/admin/api/ps/extract/brokerage/order/approve/ornot', params, config);
//打款是否成功
export const paymentSpreadWithdraw = (params, config) => axiosPost('/admin/api/ps/extract/brokerage/order/payment/success/ornot', params, config);

/*********** 会员提现 ***********/
//获取列表
export const getLuckmoneyPage = (params, config) => axiosPost('/admin/api/ps/extract/luckmoney/order/page', params, config);
//是否同意提现
export const agreeLuckmoney = (params, config) => axiosPost('/admin/api/ps/extract/luckmoney/order/approve/ornot', params, config);
//打款是否成功
export const paymentLuckmoney = (params, config) => axiosPost('/admin/api/ps/extract/luckmoney/order/payment/success/ornot', params, config);


/*********** 同城、生产企业 ***********/
//获取列表
export const getShopFinaPage = (params, config) => axiosPost('/admin/api/cs/shop/bankroll/account/page', params, config);
// 冻结解冻资金账户
export const statusShopFina = (params, config) => axiosPost('/admin/api/cs/shop/bankroll/account/status', qs.stringify(params), config);
// //获取详情
// export const getShopFinaInfo = (params, config) => axiosPost('/admin/api/cs/shopbankrollaccount/get', params, config);
// //获取资金流水列表
// export const getShopFinaRecordPage = (params, config) => axiosPost('/admin/api/st/storeaccountbankrollrecord/page', params, config);
// //获取资金账户详情
// export const getShopFinaRecordInfo = (params, config) => axiosPost('admin/api/st/storeaccountbankrollrecord/get', params, config);

/*********** 线下店铺 ***********/
//获取列表
export const getStoreFinaPage = (params, config) => axiosPost('/admin/api/st/store/bankroll/account/page', params, config);
// 冻结解冻资金账户
export const statusStoreFina = (params, config) => axiosPost('/admin/api/st/store/bankroll/account/status', qs.stringify(params), config);
// //获取详情
// export const getStoreFinaInfo = (params, config) => axiosPost('/admin/api/st/storeaccountbankroll/get', qs.stringify(params), config);
// //获取资金流水列表
// export const getStoreFinaRecordPage = (params, config) => axiosPost('/admin/api/st/storeaccountbankrollrecord/page', params, config);
// //获取线下店老板资金账户详情
// export const getStoreFinaRecordInfo = (params, config) => axiosPost('/admin/api/st/storeaccountbankrollrecord/get', params, config);

/*********** 线下商户 ***********/
//获取列表
export const getSellerFinaPage = (params, config) => axiosPost('/admin/api/st/store/account/bankroll/page', params, config);
// 冻结解冻资金账户
export const statusSellerFina = (params, config) => axiosPost('/admin/api/st/store/account/bankroll/status', qs.stringify(params), config);
// //获取详情
// export const getStoreFinaInfo = (params, config) => axiosPost('/admin/api/st/storeaccountbankroll/get', qs.stringify(params), config);
// //获取资金流水列表
// export const getStoreFinaRecordPage = (params, config) => axiosPost('/admin/api/st/storeaccountbankrollrecord/page', params, config);
// //获取线下店老板资金账户详情
// export const getStoreFinaRecordInfo = (params, config) => axiosPost('/admin/api/st/storeaccountbankrollrecord/get', params, config);

/*********** mer ***********/
//获取列表
export const getMerFinaPage = (params, config) => axiosPost('/admin/api/mer/manager/bankroll/account/page', params, config);
// //获取详情
// export const getMerFinaInfo = (params, config) => axiosPost('/admin/api/mer/manager/bankroll/account/find',  qs.stringify(params), config);
// 获取资金流水列表
// export const getMerFinaRecordPage = (params, config) => axiosPost('/admin/api/mer/manager/bankroll/account/record/page', params, config);
// //获取资金流水详情
// export const getMerFinaRecordInfo = (params, config) => axiosPost('/admin/api/mer/manager/bankroll/account/record/get', qs.stringify(params), config);
//修改账户状态
export const statusMerFina = (params, config) => axiosPost('/admin/api/mer/manager/bankroll/account/update/status', qs.stringify(params), config);

/************************* 结算单 *************************/

/*********** 企业货款 ***********/
//获取列表
export const getShopSettlementPage = (params, config) => axiosPost('/admin/api/online/settle/account/order/page', params, config);

/*********** 商圈货款 ***********/
//获取列表
export const getStoreSettlementPage = (params, config) => axiosPost('/admin/api/offine/settle/account/order/page', params, config);

/*********** 收益 ***********/
//获取列表
export const getProfitSettlementPage = (params, config) => axiosPost('/admin/api/ps/brokerage/distribute/order/list/page', params, config);

/*********** 红包 ***********/
//获取列表
export const getPacketsSettlementPage = (params, config) => axiosPost('/admin/api/ps/luck/money/distribute/order/list/page', params, config);


/*********************** 收支明细 ***********************/

/*********** 企业 ***********/
//获取列表
export const getShopBalancePage = (params, config) => axiosPost('/admin/api/shop/bankroll/account/record/page', params, config);

/*********** 线下店铺 ***********/
//获取列表
export const getStoreBalancePage = (params, config) => axiosPost('/admin/api/st/store/bankroll/account/record/page', params, config);

/*********** mer ***********/
//获取列表
export const getMerBalancePage = (params, config) => axiosPost('/admin/api/mer/manager/bankroll/account/record/page', params, config);

/*********** 线下商户 ***********/
//获取列表
export const getSellerBalancePage = (params, config) => axiosPost('/admin/api/st/store/account/bankroll/record/page', params, config);

/*********** 会员红包 ***********/
//获取列表
export const getRedBalancePage = (params, config) => axiosPost('/admin/api/tc/member/luckmoney/account/record/list/page', params, config);

/*********** 会员积分 ***********/
//获取列表
export const getScoreBalancePage = (params, config) => axiosPost('/admin/api/tc/member/integral/account/record/list/page', params, config);

/*********************** 支付单 ***********************/

/*********** 支付单 ***********/
//获取列表
export const getPayoffOrderPage = (params, config) => axiosPost('/admin/api/ps/pay/order/page', params, config);


/**************************** 审核管理 ****************************/

/*********** 一般审核 ***********/
//一般审核列表
export const getApprovalPage = (params, config) => axiosPost('/admin/api/oa/approval/content/page', params, config);
//审核详情
export const getApprovalInfo = (params, config) => axiosPost('/admin/api/oa/approval/content/get', qs.stringify(params), config);
//保存审核内容
// export const setApprovalInfo = (params, config) => axiosPost('/admin/api/oa/approval/content/save', params, config);
//更新审核内容
// export const updateApprovalInfo = (params, config) => axiosPost('/admin/api/oa/approval/content/update', params, config);
//审核
export const setApproval = (params, config) => axiosPost('/admin/api/oa/approval/content/approveornot', params, config);
//记录列表
export const getApprovalRecord = (params, config) => axiosPost('/admin/api/oa/approval/record/page', params, config);
//审核记录详情
// export const getApprovalRecordInfo = (params, config) => axiosPost('/admin/api/oa/approval/record/get', params, config);

/*********** 同城企业预推广 ***********/
//列表
export const getShopCluePage = (params, config) => axiosPost('/admin/api/cs/shop/city/clue/page', params, config);
//详情
export const getShopClueInfo = (params, config) => axiosPost('/admin/api/cs/shop/city/clue/select', qs.stringify(params), config);

/*********** 审核配置 **********/
// 获取审核配置列表分页
export const auditConfigList = (params, config) => axiosPost('/admin/api/sys/approval/config/page', params, config);
// 获取审核配置列表不分页
export const auditConfig = (params, config) => axiosPost('/admin/api/sys/approval/config/list', params, config);
// 添加审核配置
export const saveAuditConfig = (params, config) => axiosPost('/admin/api/sys/approval/config/save', params, config);
// 更新审核配置
export const updateAuditConfig = (params, config) => axiosPost('/admin/api/sys/approval/config/update', params, config);
// 删除审核配置
export const delAuditConfig = (params, config) => axiosPost('/admin/api/sys/approval/config/delete', qs.stringify(params), config);

/*********** 审核人 **********/
//添加审批人
export const addApprovalPeople = (params, config) => axiosPost('/admin/api/sys/approval/people/config/save', params, config);
//审核人列表不分页
export const getApprovalPeople = (params, config) => axiosPost('/admin/api/sys/approval/people/config/list', params, config);

//删除审核人
export const delApprovalPeople = (params, config) => axiosPost('/admin/api/sys/approval/people/config/delete', params, config);

/**************************** 会员管理 ****************************/
/*********** 会员管理 ***********/
//会员列表
export const getMember = (params, config) => axiosPost('/admin/api/tc/member/page', params, config);
//会员详情
export const findMember = (params, config) => axiosPost('/admin/api/tc/member/find', qs.stringify(params), config);
//线上店铺收藏记录
export const collectShopRecord = (params, config) => axiosPost('/admin/api/tc/member/collect/shop/record/page', params, config);
//线下店铺收藏记录
export const collectStoreRecord = (params, config) => axiosPost('/admin/api/tc/member/collect/store/record/page', params, config);

/*********** 会员分享关系列表 ***********/
//会员分享关系列表
export const getMemberInviteRecord = (params, config) => axiosPost('/admin/api/tc/member/invite/record/page', params, config);

/*********** 会员活动参与记录 ***********/
//会员活动参与记录分页
export const getMemberActivity = (params, config) => axiosPost('/admin/api/tc/member/activity/record/page', params, config);
//会员参与活动详情
export const findMemberActivity = (params, config) => axiosPost('/admin/api/tc/member/activity/record/find', qs.stringify(params), config);

/*********** 会员积分账户 ***********/
//会员积分账户分页
export const getMemberIntegral = (params, config) => axiosPost('/admin/api/tc/member/integral/account/page', params, config);
//会员积分账户详情
export const findMemberIntegral = (params, config) => axiosPost('/admin/api/tc/member/integral/account/get', qs.stringify(params), config);
//会员积分账户冻结解冻
export const findMemberIntegralStatus = (params, config) => axiosPost('/admin/api/tc/member/integral/account/status', qs.stringify(params), config);

/*********** 会员积分账户流水 ***********/
//会员积分账户流水分页
export const getMemberIntegralRecord = (params, config) => axiosPost('/admin/api/tc/member/integral/account/record/page', params, config);

/*********** 会员红包账户 ***********/
//会员红包账户分页
export const getMemberLuckmoneyAccount = (params, config) => axiosPost('/admin/api/tc/member/luckmoney/account/page', params, config);
//会员红包账户详情
export const findMemberLuckmoneyAccount = (params, config) => axiosPost('/admin/api/tc/member/luckmoney/account/get', qs.stringify(params), config);
//会员红包账户冻结解冻
export const findMemberLuckmoneyAccountStatus = (params, config) => axiosPost('/admin/api/tc/member/luckmoney/account/status', qs.stringify(params), config);

/*********** 会员红包账户流水 ***********/
//会员红包账户流水分页
export const getMemberLuckmoneyAccountRecord = (params, config) => axiosPost('/admin/api/tc/member/luckmoney/account/record/page', params, config);

/*********** 会员收货地址管理 ***********/
//会员收货地址列表
export const getmemberAddress = (params, config) => axiosPost('/admin/api/tc/member/shipping/address/page', params, config);
// 根据id查询
export const selectMemberAddress = (params, config) => axiosPost('/admin/api/tc/member/shipping/address/select', qs.stringify(params), config);

/*********** 会员消息 ***********/
// 获取消息列表
export const getMemberMessage = (params, config) => axiosPost('/admin/api/sm/message/member/record/page', params, config);
// 获取消息详情
export const getMemberMessageDetail = (params, config) => axiosPost('/admin/api/sm/message/member/record/get', qs.stringify(params), config);
// 新增消息
export const saveMemberMessage = (params, config) => axiosPost('/admin/api/sm/message/member/record/save', params, config);
// 标记已读
export const readMemberMessage = (params, config) => axiosPost('/admin/api/sm/message/member/record/read', qs.stringify(params), config);

/*********** 商务合作记录 ***********/
// 获取商务合作记录列表
export const getBusinessCooperate = (params, config) => axiosPost('/admin/api/oa/business/cooperate/record/page', params, config);
// 获取商务合作记录详情
export const getBusinessCooperateDetail = (params, config) => axiosPost('/admin/api/oa/business/cooperate/record/get', qs.stringify(params), config);
// 修改商务合作记录状态
export const updateBusinessCooperate = (params, config) => axiosPost('/admin/api/oa/business/cooperate/record/update', params, config);

/*********** 意见反馈 ***********/
// 获取意见反馈列表
export const getFeedBack = (params, config) => axiosPost('/admin/api/oa/feed/back/page', params, config);
// 修改意见反馈状态
export const updateFeedBack = (params, config) => axiosPost('/admin/api/oa/feed/back/update/status', params, config);

/*********** 线下订单 ***********/
// 获取线下订单列表
export const getOfflineOrder = (params, config) => axiosPost('/admin/api/ots/offline/order/page', params, config);
// 获取线下订单详情
export const getOfflineOrdeDetail = (params, config) => axiosPost('/admin/api/ots/offline/order/find', qs.stringify(params), config);
// 获取线下订单评价详情
export const findOfflineOrderEvaluate = (params, config) => axiosPost('/admin/api/ots/offline/order/evaluate/record/find/order', qs.stringify(params), config);

/*********** 线上订单 ***********/
// 获取线下订单列表
export const getOnlineOrder = (params, config) => axiosPost('/admin/api/online/order/page', params, config);
// 获取线下订单详情
export const getOnlineOrdeDetail = (params, config) => axiosPost('/admin/api/online/order/get/info', qs.stringify(params), config);

/*********** 退款订单 ***********/
// 获取退款订单列表
export const getRefundApply = (params, config) => axiosPost('/admin/api/osm/online/customer/service/order/page', params, config);
// 客服拒绝退款
export const getServiceRefuse = (params, config) => axiosPost('/admin/api/osm/online/customer/service/order/platform/refuse', qs.stringify(params), config);
// 客服同意退款
export const getServiceSuccess = (params, config) => axiosPost('/admin/api/osm/online/customer/service/order/platform/success', qs.stringify(params), config);
// 订单商家售后记录列表
export const getServiceRecord = (params, config) => axiosPost('/admin/api/osm/online/customer/service/order/record/list', qs.stringify(params), config);
// 订单商家售后记录详情
export const findServiceRecord = (params, config) => axiosPost('/admin/api/osm/online/customer/service/order/record/find', qs.stringify(params), config);
// 查看物流详情
export const expressInfo = (params, config) => axiosPost('/admin/api/express/query/info', qs.stringify(params), config);

// 查看评价信息
export const findEvaluateDetails = (params, config) => axiosPost('/admin/api/osm/online/order/evaluate/record/find/details', params, config);

// 线下店铺补偿接口
export const payStoreSonaccount = (params, config) => axiosPost('/admin/api/ping/an/pay/store/sonaccount', qs.stringify(params), config);
// 线上店铺补偿接口
export const payShopSonaccount = (params, config) => axiosPost('/admin/api/ping/an/pay/shop/sonaccount', qs.stringify(params), config);

// 线下店铺资金账户余额或者功能性子账户余额
export const payStoreSonmoney = (params, config) => axiosPost('/admin/api/ping/an/pay/store/sonmoney', qs.stringify(params), config);
// 线上店铺资金账户余额或者功能性子账户余额
export const payShopSonmoney = (params, config) => axiosPost('/admin/api/ping/an/pay/shop/sonmoney', qs.stringify(params), config);
