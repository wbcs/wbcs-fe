import * as Vue from 'vue'
import * as Vuex from 'vuex'
import { remote } from 'electron'

import MULTI_LANG_TEXT from '@/config/lang'

import chat from './chat'
import main from './main'
import grouping from './grouping'
import functions from './functions'

const REMOTE_STORE = remote.getGlobal('store')
const language = REMOTE_STORE.get('lang')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    uid: REMOTE_STORE.get('uid'),
    language,
    REMOTE_STORE,
    MULTI_LANG_TEXT: MULTI_LANG_TEXT[language || 'zh-CN']
  },
  mutations: {
    setUid(state, uid) {
      state.uid = uid
    }
  },
  modules: {
    chat,
    main,
    grouping,
    functions
  },
  strict: __DEV__
})
