const { Menu, BrowserWindow, dialog, app } = require('electron')
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
  template.unshift({
    label: 'wbcs',
    submenu: [
      {
        label: `About wbcs`,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: `Hide wbcs`,
        accelerator: 'Command+H',
        role: 'hide'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      },
      {
        label: 'Show All',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() {
          app.quit()
        }
      },
      {
        label: 'Edit',
        submenu: [
          { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
          {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            selector: 'paste:'
          }
        ]
      }
    ]
  })
}

module.exports = () => {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
