const { Menu, BrowserWindow, dialog, app } = require('electron')

const template = [
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click(item, focusedWindow) {
          if (focusedWindow) {
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
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator:
          process.platform === 'darwin' ? 'option+cmd+J' : 'option+ctrl+J',
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            focusedWindow.toggleDevTools()
          }
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'show dialog',
        click(item, focusedWindow) {
          if (focusedWindow) {
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
      }
    ]
  }
]

// if (process.platform === 'darwin') {
//   const name = app.getName()

//   template.unshift({
//     label: name,
//     submenu: [
//       {
//         label: `About ${name}`,
//         role: 'about'
//       },
//       {
//         type: 'separator'
//       },
//       {
//         label: 'Services',
//         role: 'services',
//         submenu: []
//       },
//       {
//         type: 'separator'
//       },
//       {
//         label: `Hide ${name}`,
//         accelerator: 'Command+H',
//         role: 'hide'
//       },
//       {
//         label: 'Hide Others',
//         accelerator: 'Command+Alt+H',
//         role: 'hideothers'
//       },
//       {
//         label: 'Show All',
//         role: 'unhide'
//       },
//       {
//         type: 'separator'
//       },
//       {
//         label: 'Quit',
//         accelerator: 'Command+Q',
//         click() {
//           app.quit()
//         }
//       }
//     ]
//   })
// }


module.exports = () => {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
