const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const setMenu = require('./menu')

const loadGlobalVariable = () => {
  const path = require('path')
  const Store = require('electron-store')
  const socketClient = require('socket.io-client')

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
  if (process.env.NODE_ENV !== 'development') {
    global.__static = path
      .join(__dirname, '/static')
      .replace(/\\/g, '\\\\')
  }
}
const setIPCEventHandlers = () => {
  ipcMain.on('save-user-data', (_, data) => {
    global.store.set(data)
  })
  ipcMain.on('show-error-dialog', (_, msg) => {
    dialog.showErrorBox(msg.title, msg.content)
  })
  ipcMain.on('login', () => {
    mainWindow && mainWindow.close()
    global.isAllowLogin = true
    createWindow()
  })
  ipcMain.on('logout', () => {
    mainWindow && mainWindow.close()
    global.isAllowLogin = false
    openLoginWindow()
  })
}
const setAppEventHandlers = () => {
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
  app.on('window-all-closed', () => {
    if (process.platform === 'darwin') return
    app.quit()
  })
  app.on('open-file', e => e.preventDefault())
  app.on('open-url', e => e.preventDefault())
  app.on('activate', () => {
    if (!mainWindow) return
    createWindow()
  })
}
const openLoginWindow = () => {
  createWindow({
    width: 280,
    height: 400,
    resizable: false
  })
}
const createWindow = (configObj = {}) => {
  // const winURL =
  //   process.env.NODE_ENV === 'development'
  //     ? 'http://localhost:9080'
  //     : `file://${__dirname}/index.html`

  const winURL = 'http://localhost:9080'

  mainWindow = new BrowserWindow({
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
    ...configObj
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.loadURL(winURL)
  mainWindow.show()
}

let mainWindow = null
loadGlobalVariable()
setIPCEventHandlers()
setAppEventHandlers()
setMenu()
