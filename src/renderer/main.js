import * as Vue from 'vue'

import App from './app'
import router from '@/router'
import store from '@/store'

import './index.less'

document.addEventListener('dragover', e => e.preventDefault())
document.addEventListener('drop', e => e.preventDefault())

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')

