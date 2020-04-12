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
    webSecurity: true
  }
}

module.exports = {
  getQuit,
  setQuit,
  DEFAULT_CONFIG
}
