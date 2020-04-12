const execa = require('execa')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('./build-config')

const buildElectron = async () => {
  await execa(
    'electron-builder',
    ['--mac', '--config', ['build.yml'].filter(_ => _).join(',')],
    { stdio: 'inherit' }
  )
  console.log(chalk.green('build electron success.'))
}

const build = () => {
  webpack(config, err => {
    if (err) {
      console.log(err)
      return
    }
    console.log(chalk.green('build web success.'))
    buildElectron()
  })
}

build()
