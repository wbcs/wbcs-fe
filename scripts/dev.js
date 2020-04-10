const path = require('path')
const execa = require('execa')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./render')
const resolve = (filename) => path.resolve(__dirname, filename)

let lock = false
const run = () => {
  const compiler = webpack(config)
  compiler.hooks.done.tap('start electron', () => {
    if (!lock) {
      lock = true
      execa(
        'electron',
        [
          resolve('../src/main/index.js'),
          'NODE_ENV=development'
        ],
        { stdout: 'inherit' }
      )
    }
  })
  const server = new WebpackDevServer(compiler)
  server.listen(9080)
}

run()
