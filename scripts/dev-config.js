const merge = require('webpack-merge')
const WebapckChain = require('webpack-chain')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const baseConfig = require('./base-config')

const chainConfig = new WebapckChain()

chainConfig.mode('development').end()

chainConfig.output.publicPath('/').end()

chainConfig
  .plugin('friendly-errors-webpack-plugin')
  .use(FriendlyErrorsWebpackPlugin, [
    {
      compilationSuccessInfo: {
        messages: ['You application is running.'],
        notes: [
          'Some additional notes to be displayed upon successful compilation'
        ]
      },
      clearConsole: true
    }
  ])
  .end()

chainConfig.devServer
  .set('port', 9080)
  .set('quiet', true)
  .set('historyApiFallback', true)
  .end()

module.exports = merge(baseConfig, chainConfig.toConfig())
