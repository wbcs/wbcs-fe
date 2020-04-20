const path = require('path')
const Store = require('electron-store')
const socketClient = require('socket.io-client')

const loadGlobalVariable = () => {
  const store = new Store({
    name: 'wbcs.config',
    encryptionKey: 'wbcs'
  })
  const socket = socketClient('http://localhost:3000', {
    reconnection: true
  })
  global.store = store
  global.socket = socket
  global.isAllowLogin = false
  if (!__DEV__) {
    global.__static = path
      .join(__dirname, '/static')
      .replace(/\\/g, '\\\\')
  }
}

module.exports = {
  loadGlobalVariable
}
