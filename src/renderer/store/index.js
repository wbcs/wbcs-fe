import * as Vuex from 'vuex'
import { remote } from 'electron'

import MULTI_LANG_TEXT from '@/config/lang'
const currentLanguage = remote.getGlobal('store').get('lang')

const files = require.context('./modules', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  if (key === './index.js') {
    return
  }
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default Vuex.createStore({
  state: {
    currentLanguage,
    lang: MULTI_LANG_TEXT[currentLanguage || 'zh-CN'],
    uid: remote.getGlobal('store').get('uid')
  },
  mutations: {
    setUid(state, uid) {
      state.uid = uid
    }
  },
  actions: {},
  modules
})
