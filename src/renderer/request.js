import { remote } from 'electron'
export const SOCKET = remote.getGlobal('socket')

export const fetchLogin = params =>
  new Promise((resolve, reject) => {
    SOCKET.emit('login', params, data => {
      if (!data.isAllowLogin) return reject()
      resolve(data)
    })
  })

export const fetchAuthcode = params =>
  new Promise((resolve) => {
    SOCKET.emit('get-authcode', params, resolve)
  })
