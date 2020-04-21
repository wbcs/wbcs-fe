const webpack = require('webpack')
const electron = require('electron')
const { spawn } = require('child_process')
const WebpackDevServer = require('webpack-dev-server')

const config = require('./dev-config')
const { log, resolve } = require('./utils')

const runElectron = () => {
  const elec = spawn(electron, [resolve('../src/main/index.js')])
  elec.on('close', process.exit)
  elec.stdout.on('data', data => log.info(data.toString()))
  elec.stderr.on('data', data => log.error(data.toString()))
}

let lock = false
const run = () => {
  const compiler = webpack(config)
  compiler.hooks.done.tap('start electron', () => {
    if (lock) return
    lock = true
    runElectron()
  })
  const server = new WebpackDevServer(compiler, config.devServer || {})
  server.listen(config.devServer.port)
}

run()
