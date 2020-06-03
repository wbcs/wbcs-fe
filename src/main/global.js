const Store = require('electron-store')
const socketClient = require('socket.io-client')
const { app } = require('electron')

const loadGlobalVariable = () => {
  const store = new Store({
    name: 'wbcs.config',
    encryptionKey: 'wbcs'
  })
  const socket = socketClient('http://localhost:3000', {
    reconnection: true
  })
  console.log(app.getPath('userData'))
  global.store = store
  global.socket = socket
  global.isAllowLogin = false
  socket.on('EMIT_USER_CONNECT', () => {
    socket.emit('user-connect', store.get('uid'))
  })
}

module.exports = {
  loadGlobalVariable
}
