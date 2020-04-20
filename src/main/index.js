const path = require('path')
const { BrowserWindow } = require('electron')

const { setIPCEventHandlers } = require('./ipc')
const { setAppEventHandlers, setIconInMAC } = require('./app')
const { loadGlobalVariable } = require('./global')
const { DEFAULT_CONFIG, getQuit } = require('./utils')

const openLoginWindow = () =>
  createWindow({
    width: 280,
    height: 400,
    minWidth: 280,
    minHeight: 400,
    resizable: __DEV__
  })
const createWindow = (configObj = {}) => {
  const WIN_URL = __DEV__
    ? 'http://localhost:9080'
    : `file://${path.resolve(__dirname, '../../dist/index.html')}`

  winRef.mainWindow = new BrowserWindow({
    ...DEFAULT_CONFIG,
    ...configObj
  })
  setIconInMAC()
  winRef.mainWindow.on('close', e => {
    if (getQuit()) {
      winRef.mainWindow = null
      return
    }
    e.preventDefault()
    winRef.mainWindow.hide()
  })
  winRef.mainWindow.loadURL(WIN_URL)
}

const winRef = {
  mainWindow: null
}

loadGlobalVariable()
setIPCEventHandlers(winRef, createWindow, openLoginWindow)
setAppEventHandlers(winRef, createWindow, openLoginWindow)
