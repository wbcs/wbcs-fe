const merge = require('webpack-merge')
const WebapckChain = require('webpack-chain')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const baseConfig = require('./base-config')

const chainConfig = new WebapckChain()

chainConfig.mode('production').end()
// chainConfig.mode('development').end()

chainConfig
  .plugin('clean')
  .use(CleanWebpackPlugin)
  .end()

module.exports = merge(baseConfig, chainConfig.toConfig())
