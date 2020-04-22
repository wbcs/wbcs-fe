const store = {
  namespaced: true,
  state: {
    currentCategoryId: NaN,
    currentContact: {}
  },
  mutations: {
    setCurrentCategoryID(state, id) {
      state.currentCategoryId = id
    },
    setCurrentContact(state, contact) {
      state.currentContact = contact
    }
  }
}

export default store
