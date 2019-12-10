import {asyncRouterMap, constantRouterMap} from '@/router'
import router from "../../router";

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.routers = constantRouterMap.concat(routers)
      state.addRouters = routers
    }
  },
  actions: {
    GenerateRoutes({commit}, data) {
      return new Promise(resolve => {
        let infoData = data;
        let accessResourcesList = []; //权限列表 accessResources 数组
        infoData.forEach(item => item.accessResources ? accessResourcesList.push(item.accessResources) : null);
        // 遍历菜单列表
        const traverseTree = route => {
          if (!route) return;
          route.hidden = true; //默认全部菜单隐藏
          // if ((route.meta && route.meta.notMenu) || route.name === 'dashboard') return; //如果菜单为home 或 不是菜单路由返回
          if (route.name && accessResourcesList.indexOf(route.name) !== -1) { //如果路由在功能列表中
            route.hidden = false;
          }
          if (route.children && route.children.length > 0) {  //有子元素递归
            let flag = false; //检查子元素是否有显示
            route.children.forEach(item => {
              traverseTree(item);  // 递归每个 子元素
              if (!item.hidden) {  // 递归结束 如果子元素为显示状态 则设置父元素显示
                // console.log('item',item)
                route.hidden = false;
                flag = true;
              }
            });
            if (!flag) { //如无子元素显示 删除子元素列表
              delete route.children;
            }
          }
        };
        asyncRouterMap.forEach(item => traverseTree(item));
        commit('SET_ROUTERS', asyncRouterMap)
        resolve()
      })
    }
  }
}

export default permission
