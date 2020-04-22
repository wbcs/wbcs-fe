const store = {
  namespaced: true,
  state: {
    currentFunction: ''
  },
  mutations: {
    setCurrentFunction(state, flag) {
      state.currentFunction = flag
    }
  }
}

export default store
