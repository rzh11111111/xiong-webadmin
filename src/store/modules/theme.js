import sessionStorage from "../sessionStorage";
import localStorage from "../localStorage";

const theme = {
  state: {
    // color: localStorage.$getLocalStorageByName('colorPicker')
    color: '#409EFF'
  },

  mutations: {
    SET_COLOR: (state, color) => {
      state.color = color;
    }
  },

  actions: {
    getTheme({commit}, {color}) {
      commit('SET_COLOR', color)
    }
  }
}

export default theme
