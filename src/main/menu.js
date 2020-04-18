const path = require('path')
const { Menu, BrowserWindow, Tray, dialog } = require('electron')
const IS_MAC = process.platform === 'darwin'

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

if (IS_MAC) {
  if (process.platform === 'darwin') {
    template.push({
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' },
        { role: 'quit' },
        { role: 'close' }
      ]
    })
  }
}


const setMenu = () => {
  // const icon = new Tray(path.join(__dirname, '../icon.png'));
  // icon.setToolTip('hello poetries');
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  // setHehe()
  // icon.setContextMenu(menu)
}



// const setHehe = () => {
//   const appIcon = new Tray(path.join(__dirname, '../temp.jpg'));
// const menu = Menu.buildFromTemplate([
//     {
//         label: '设置',
//         click: function() {} //打开相应页面 
//     },
//     {
//         label: '帮助',
//         click: function() {}
//     },
//     {
//         label: '关于',
//         click: function() {}
//     },
//     {
//         label: '退出',
//         click: function() { 
//     }
// }])
// // 鼠标放上去提示信息
// appIcon.setToolTip('hello poetries');
// appIcon.setContextMenu(menu);

// }

module.exports = {
  setMenu
}
