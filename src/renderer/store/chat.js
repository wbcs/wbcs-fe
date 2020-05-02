const NAME_SPACE = 'chat/historyList'
const getStorage = (key, defaultVal) => {
  const storageData = localStorage.getItem(key)
  return JSON.parse(storageData) || defaultVal
}
const setStorage = (key, value) => {
  const stringifyVal = JSON.stringify(value)
  localStorage.setItem(key, stringifyVal)
}

const store = {
  namespaced: true,
  state: {
    currentChat: '',
    historyList: [],
  },
  mutations: {
    setCurrentChat(state, chat) {
      state.currentChat = chat
    },
    loadRecentChat(state) {
      state.historyList = getStorage(NAME_SPACE, [])
    },
    newChat(state, { uid, gid }) {
      const historyList = getStorage(NAME_SPACE, [])
      const id = uid || gid
      if (historyList.includes(id)) return
      historyList.push(id)
      state.historyList.push(id)
      setStorage(NAME_SPACE, historyList)
    },
    removeChat(state, currItem) {
      const index = state.historyList.indexOf(currItem)
      if (index === -1) return
      state.historyList.splice(index, 1)
      setStorage(NAME_SPACE, state.historyList)
    }
  }
}

export default store
