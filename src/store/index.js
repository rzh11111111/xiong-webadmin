import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import user from './modules/user'
import theme from './modules/theme'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    permission,
    app,
    tagsView,
    user,
    theme
  },
  getters
})

export default store
