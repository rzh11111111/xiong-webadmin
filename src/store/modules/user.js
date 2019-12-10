import Api from '@/Api'
import {getToken, setToken, removeToken} from '@/utils/auth'
import sessionStorage from "../sessionStorage";

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: '',
    setting: {
      articlePlatform: []
    },
    userId: '',
    loginTime: '',
    loginIp: '',
    deps: []
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_LOGINIP: (state, loginIp) => {
      state.loginIp = loginIp
    },
    SET_LOGINTIME: (state, loginTime) => {
      state.loginTime = loginTime
    },
    SET_DEPS: (state, deps) => {
      state.deps = deps
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({commit, rootState}, userInfo) {
      userInfo.username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        Api.testApi.loginByUsername(userInfo).then(res => {
          sessionStorage.$setSessionStorageByName('userId', res.data.userId)
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({commit, state}) {
      return new Promise((resolve, reject) => {
        Api.testApi.getEmployee().then(res => {
          if (!res) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          commit('SET_NAME', res.data.name)
          commit('SET_USERNAME', res.data.username)
          commit('SET_INTRODUCTION', res.data.phone)
          commit('SET_ROLES', res.data.nickname)
          commit('SET_USERID', res.data.id)
          commit('SET_LOGINIP', res.data.loginIp)
          commit('SET_LOGINTIME', res.data.loginTime)
          commit('SET_DEPS', res.data.deps)

          // commit('SET_NAME', res.data.userName)
          // commit('SET_AVATAR', 'http://img1.imgtn.bdimg.com/it/u=2156627834,2505977031&fm=26&gp=0.jpg')
          // // commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({commit, state}) {
      return new Promise((resolve, reject) => {
        Api.testApi.logout().then(res => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端登出
    FedLogOut({commit}) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({commit}, role) {
      // console.log('res',role)
      return new Promise(resolve => {
        // commit('SET_TOKEN', role)
        // setToken(role)
        // Api.testApi.getUserInfo({token: role}).then(res => {
        Api.testApi.getUserInfo().then(res => {
          let roles = []
          if (role === '超级管理员') {
            res.data.userInfo.roleName = 'admin'
          } else {
            res.data.userInfo.roleName = role
          }
          roles.push(res.data.userInfo.roleName)
          commit('SET_ROLES', roles)
          commit('SET_NAME', res.name)
          commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
          commit('SET_INTRODUCTION', res.introduction)
          commit('SET_LOGINIP', res.data.loginIp)
          commit('SET_LOGINTIME', res.data.loginTime)
          commit('SET_DEPS', res.data.deps)
          resolve(res)
          resolve()
        })
      })
    }
  }
}

export default user
