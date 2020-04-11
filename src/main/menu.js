const { Menu, BrowserWindow, dialog } = require('electron')
const isMac = process.platform === 'darwin'

const template = [
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click(_, focusedWindow) {
          if (!focusedWindow) return
          // on reload, start fresh and close any old
          // open secondary windows
          if (focusedWindow.id === 1) {
            BrowserWindow.getAllWindows().forEach(win => {
              if (win.id > 1) {
                win.close()
              }
            })
          }

          focusedWindow.reload()
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator:
          process.platform === 'darwin' ? 'option+cmd+J' : 'option+ctrl+J',
        click(_, focusedWindow) {
          if (!focusedWindow) return
          focusedWindow.toggleDevTools()
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'show dialog',
        click(_, focusedWindow) {
          if (!focusedWindow) return
          const options = {
            type: 'error',
            title: 'Application Menu Demo',
            buttons: ['确认', '取消'],
            message:
              'This demo is for the Menu section, showing how to create a clickable menu item in the application menu.'
          }
          dialog.showMessageBox(focusedWindow, options, function() {
            console.log('dialog message here')
          })
        }
      }
    ]
  }
]



if (isMac) {
  if (process.platform === 'darwin') {
    template.push({
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'pasteandmatchstyle'},
        {role: 'delete'},
        {role: 'selectall'}
      ]
    })
  }
}

module.exports = () => {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
