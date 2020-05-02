const path = require('path')
const { BrowserWindow, autoUpdater, dialog } = require('electron')
// const updateElectronApp = require('update-electron-app')

const { setIPCEventHandlers } = require('./ipc')
const { setAppEventHandlers, setIconInMAC } = require('./app')
const { loadGlobalVariable } = require('./global')
const { DEFAULT_CONFIG, getQuit } = require('./utils')

const __DEV__ = process.env.NODE_ENV === 'development'

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
    : `file://${path.resolve(__dirname, '../../dist/web/index.html')}`

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
// updateElectronApp({
//   repo: 'https://github.com/wbcs/wbcs-fe'
// })


autoUpdater.setFeedURL('https://github.com/wbcs/wbcs-fe/releases/tag/0.1.0')
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
})
autoUpdater.on('error', message => {
  console.error('There was a problem updating the application')
  console.error(message)
})
