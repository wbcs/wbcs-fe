const path = require('path')
const { ipcMain, dialog, BrowserWindow } = require('electron')
const { DEFAULT_CONFIG } = require('./utils')

const __DEV__ = process.env.NODE_ENV === 'development'

const openVideoWindow = (winRef, data) => {
  const { uid, type } = data
  const WIN_URL = __DEV__
    ? `http://localhost:9080/video-chat?to=${uid}&type=${type}`
    : `file://${path.resolve(__dirname, '../../dist/web/index.html')}`

  let subWindow = new BrowserWindow({
    ...DEFAULT_CONFIG,
    width: 600,
    height: 360,
    minWidth: 600,
    minHeight: 360,
    useContentSize: true,
  })
  subWindow.on('closed', () => {
    subWindow = null
    winRef.mainWindow.webContents.send('sub-closed')
  })
  subWindow.webContents.on('did-finish-load', () => {
    subWindow.webContents.send('goto-video', data)
  })
  subWindow.setAspectRatio(600 / 360)
  subWindow.loadURL(WIN_URL)
  subWindow.show()
}

const setIPCEventHandlers = (winRef, createWindow, openLoginWindow) => {
  ipcMain.on('save-user-data', (_, data) => {
    global.store.set(data)
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
  ipcMain.on('open-window', (_, data) => {
    openVideoWindow(winRef, data)
  })
  ipcMain.on('dialog', (_, data) => {
    if (data.type === 'info') {
      dialog.showMessageBox(data)
    } else if (data.type === 'error') {
      dialog.showErrorBox(data.title, data.message)
    }
  })
}

module.exports = {
  setIPCEventHandlers
}
