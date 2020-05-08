import { remote } from 'electron'

export class Message {
  static info({ message }) {
    remote.dialog.showMessageBox({
      type: 'info',
      message
    })
  }
  static error({ title, message }) {
    remote.dialog.showErrorBox(title, message)
  }
}
