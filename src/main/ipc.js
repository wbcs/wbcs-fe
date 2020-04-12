const { ipcMain, dialog } = require('electron')

const setIPCEventHandlers = (winRef, createWindow, openLoginWindow) => {
  ipcMain.on('save-user-data', (_, data) => {
    global.store.set(data)
  })
  ipcMain.on('show-error-dialog', (_, msg) => {
    dialog.showErrorBox(msg.title, msg.content)
  })
  ipcMain.on('login', () => {
    winRef.mainWindow && winRef.mainWindow.close()
    global.isAllowLogin = true
    createWindow()
  })
  ipcMain.on('logout', () => {
    winRef.mainWindow && winRef.mainWindow.close()
    global.isAllowLogin = false
    openLoginWindow()
  })
}

module.exports = {
  setIPCEventHandlers
}
