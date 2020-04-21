const execa = require('execa')
const webpack = require('webpack')
const config = require('./build-config')
const { log } = require('./utils')

const buildElectron = async platform => {
  await execa(
    'electron-builder',
    [`--${platform}`, '--config', 'build.yml'],
    { stdio: 'inherit' }
  )
  log.success('build electron success.')
}

const build = (platform = 'mac') => {
  webpack(config, err => {
    if (err) {
      log.error(err)
      return
    }
    log.success('build web success.')
    if (platform === 'web') return
    buildElectron(platform)
  })
}

build(process.argv[2])
