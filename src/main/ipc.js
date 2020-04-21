const path = require('path')
const { ipcMain, BrowserWindow } = require('electron')

const __DEV__ = process.env.NODE_ENV === 'development'

const openVideoWindow = (winRef, data) => {
  const { uid, type } = data
  const WIN_URL = __DEV__
    ? `http://localhost:9080/video-chat?to=${uid}&type=${type}`
    : `file://${path.resolve(__dirname, '../../dist/index.html')}`

  let subWindow = new BrowserWindow({
    width: 600,
    height: 360,
    minWidth: 600,
    minHeight: 360,
    useContentSize: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
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
}

module.exports = {
  setIPCEventHandlers
}
