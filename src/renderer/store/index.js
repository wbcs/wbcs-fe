import * as Vue from 'vue'
import * as Vuex from 'vuex'
import { remote } from 'electron'

import MULTI_LANG_TEXT from '@/config/lang'

import chat from './chat'
import main from './main'
import grouping from './grouping'
import functions from './functions'

const remoteStore = remote.getGlobal('store')
const language = remoteStore.get('lang')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    language,
    remoteStore,
    uid: remoteStore.get('uid') || '',
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
  strict: process.env.NODE_ENV !== 'production'
})
