import { remote } from 'electron'

const { dialog } = remote

export class Message {
  static info({ message }) {
    dialog.showMessageBox({
      type: 'info',
      message,
    })
  }
  static error({ title, message }) {
    dialog.showErrorBox(title, message)
  }
}
