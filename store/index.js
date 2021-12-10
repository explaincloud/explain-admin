import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: {},
    userHasLogin: false,
    menuList: [],
    menuActive: ''
  },
  mutations: {
    login(state, userInfo) {
      uni.setStorageSync('user_token', userInfo.token)
      state.userInfo = userInfo
      state.userHasLogin = true
    },
    logout(state) {
      uni.removeStorageSync('user_token')
      state.userInfo = {}
      state.userHasLogin = false
      state.menuList = []
      state.menuActive = ''
    },
    setMenuList(state, menuList) {
      state.menuList = menuList
    },
    setMenuActive(state, menuActive) {
      state.menuActive = menuActive
    }
  }
})

export default store
