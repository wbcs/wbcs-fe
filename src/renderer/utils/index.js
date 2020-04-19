import { remote } from 'electron'

const SOCKET = remote.getGlobal('socket')

export const REMOTE_STORE = remote.getGlobal('store')

export { Message } from './message'
export * from './chat'

export const generateUUID = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)

  return `${s4() + s4()}-${new Date().getTime()}`
}

export const capitalizeFirstLetter = str =>
  str.charAt(0).toUpperCase() + str.slice(1)

export const emitSocket = (event, callback) =>
  new Promise(resolve => {
    SOCKET.emit(event, resolve)
  })

export const socket = {
  on(event) {
    return new Promise(resolve => {
      SOCKET.on(event, resolve)
    })
  },
  emit(event, data) {
    return new Promise(resolve => {
      SOCKET.emit(event, data, resolve)
    })
  }
}
