const path = require('path')

let willQuit = false
const getQuit = () => willQuit
const setQuit = quit => (willQuit = quit)

const DEFAULT_CONFIG = {
  width: 900,
  height: 600,
  minWidth: 850,
  minHeight: 550,
  resizable: true,
  titleBarStyle: 'hidden',
  webPreferences: {
    nodeIntegration: true,
    webSecurity: false
  },
  icon: path.join(__dirname, '../../public/icon.png')
}

module.exports = {
  getQuit,
  setQuit,
  DEFAULT_CONFIG
}
