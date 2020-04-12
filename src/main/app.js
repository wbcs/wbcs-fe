const { app } = require('electron')
const { setQuit } = require('./utils')

const setAppEventHandlers = (winRef, createWindow, openLoginWindow) => {
  app.on('ready', () => {
    const uid = global.store.get('uid')
    if (!uid) {
      openLoginWindow()
      return
    }
    global.socket.emit('is-allow-login', uid, data => {
      if (data.isAllowLogin) {
        global.isAllowLogin = true
        createWindow()
      } else {
        openLoginWindow()
      }
    })
  })
  app.on('before-quit', () => setQuit(true))
  app.on('open-file', e => e.preventDefault())
  app.on('open-url', e => e.preventDefault())
  app.on('activate', () => {
    if (winRef.mainWindow) {
      winRef.mainWindow.show()
      return
    }
    createWindow()
  })
  app.on('window-all-closed', () => {
    if (process.platform === 'darwin') return
    winRef.mainWindow = null
    app.quit()
  })
}

module.exports = {
  setAppEventHandlers
}
