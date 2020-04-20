import * as Vue from 'vue'
import * as Vuex from 'vuex'

import chat from './chat'
import main from './main'
import grouping from './grouping'
import functions from './functions'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    chat,
    main,
    grouping,
    functions
  },
  strict: process.env.NODE_ENV !== 'production'
})
