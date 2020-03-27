const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const setMenu = require('./menu')

const loadGlobalVariable = () => {
  const path = require('path')
  const Store = require('electron-store')
  const socketClient = require('socket.io-client')

  const store = new Store({
    name: 'hola.config',
    encryptionKey: 'hola'
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
    setTimeout(() => {
      mainWindow.close()
      global.isAllowLogin = true
      openHomeWindow()
    }, 100)
  })
  ipcMain.on('logout', () => {
    setTimeout(() => {
      mainWindow.close()
      global.isAllowLogin = false
      openLoginWindow()
    }, 100)
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
        openHomeWindow()
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
    height: 400
  })
}
const openHomeWindow = () => {
  createWindow({
    width: 885,
    height: 550
  })
}
const createWindow = (configObj = {}) => {
  const winURL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:9080'
      : `file://${__dirname}/index.html`

  mainWindow = new BrowserWindow(Object.assign({
    width: 280,
    height: 400,
    // useContentSize: true,
    resizable: true,
    titleBarStyle: 'hidden'
  }, configObj))

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  // disable page zoom
  mainWindow.webContents.on('did-finish-load', function() {
    this.setZoomFactor(1)
    this.setVisualZoomLevelLimits(1, 1)
    this.setLayoutZoomLevelLimits(0, 0)
  })

  mainWindow.loadURL(winURL)
  mainWindow.show()
}

let mainWindow = null
loadGlobalVariable()
setIPCEventHandlers()
setAppEventHandlers()
setMenu()
