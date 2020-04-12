const webpack = require('webpack')
const electron = require('electron')
const { spawn } = require('child_process')
const WebpackDevServer = require('webpack-dev-server')

const config = require('./dev-config')
const { resolve } = require('./utils')

const runElectron = () => {
  const elec = spawn(electron, [resolve('../src/main/index.js')])
  elec.on('close', process.exit)
  elec.stdout.on('data', data => console.log(data.toString()))
  elec.stderr.on('data', data => console.log(data.toString()))
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
