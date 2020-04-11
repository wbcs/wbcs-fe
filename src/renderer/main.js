import * as Vue from 'vue'
import VueExtend from '@/config/vue-extends'

import App from './app'
import router from './router'
import store from './store'

import './index.less'

Vue.use(VueExtend)

// stop drag file to the app
document.addEventListener('dragover', function(event) {
  event.preventDefault()
})
document.addEventListener('drop', function(event) {
  event.preventDefault()
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
