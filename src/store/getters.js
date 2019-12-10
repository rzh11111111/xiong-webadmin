const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  username: state => state.user.username,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  userId: state => state.user.userId,
  setting: state => state.user.setting,
  loginIp: state => state.user.loginIp,
  loginTime: state => state.user.loginTime,
  deps: state => state.user.deps,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  theme: state => state.theme
}
export default getters
