import electron from 'electron'
import lang from '@/config/lang'

const remote = electron.remote
const language = remote.getGlobal('store').get('lang')

export default Vue => {
  /*
   * @desc: multi-languages support
   * @use: this.$electron
   */
  Vue.prototype.$lang = lang[language || 'zh-CN']
}
