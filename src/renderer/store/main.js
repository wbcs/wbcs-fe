const store = {
  namespaced: true,
  state: {
    userInfo: {}
  },
  mutations: {
    setUserInformation(state, userInfo) {
      state.userInfo = userInfo
    }
  }
}

export default store
