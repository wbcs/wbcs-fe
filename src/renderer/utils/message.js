import { ipcRenderer } from 'electron'

export class Message {
  static info({ message }) {
    ipcRenderer.send('dialog', {
      type: 'info',
      message
    })
  }
  static error({ title, message }) {
    ipcRenderer.send('dialog', {
      type: 'error',
      title,
      message
    })
  }
}
