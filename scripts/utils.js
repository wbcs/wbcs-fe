const path = require('path')
const chalk = require('chalk')

const resolve = filename => path.resolve(__dirname, filename)
const useStylesLoader = (conf, { loader, options }) =>
  conf
    .use(loader)
    .loader(loader)
    .options(options)
    .end()
const log = {
  success(...args) {
    console.log(chalk.green(...args))
  },
  error(...args) {
    console.log(chalk.red(...args))
  },
  info(...args) {
    console.log(chalk.cyan(...args))
  }
}

module.exports = {
  log,
  resolve,
  useStylesLoader
}
