import { createApp } from 'vue'
import App from './app'
import router from './router'
import store from './store'
import './index.less'

// stop drag file to the app
document.addEventListener('dragover', e => e.preventDefault())
document.addEventListener('drop', e => e.preventDefault())

createApp(App)
  .use(router)
  .use(store)
  .mount('#app')
