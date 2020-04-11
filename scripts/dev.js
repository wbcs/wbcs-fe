const execa = require('execa')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const config = require('./render')
const { resolve } = require('./utils')

let lock = false
const run = () => {
  const compiler = webpack(config)
  compiler.hooks.done.tap('start electron', () => {
    if (lock) return
    lock = true
    execa(
      'electron',
      [resolve('../src/main/index.js'), 'NODE_ENV=development'],
      { stdout: 'pipe' }
    )
  })
  const server = new WebpackDevServer(compiler, config.devServer || {})
  server.listen(config.devServer.port)
}

run()
