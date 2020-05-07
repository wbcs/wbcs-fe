// const updateElectronApp = require('update-electron-app')
const { autoUpdater, dialog } = require('electron')

// updateElectronApp({
//   repo: 'https://github.com/wbcs/wbcs-fe'
// })

autoUpdater.setFeedURL(
  'https://github.com/wbcs/wbcs-fe/releases/tag/0.1.0'
)
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail:
      'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts).then(returnValue => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
})
autoUpdater.on('error', message => {
  console.error('There was a problem updating the application')
  console.error(message)
})
