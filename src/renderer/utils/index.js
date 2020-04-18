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
