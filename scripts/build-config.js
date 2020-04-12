const merge = require('webpack-merge')
const WebapckChain = require('webpack-chain')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const baseConfig = require('./base-config')
const { resolve } = require('./utils')

const chainConfig = new WebapckChain()

chainConfig.mode('production').end()

chainConfig.module
  .rule('vue')
  .test(/\.vue$/)
  .use('vue-loader')
  .loader('vue-loader')
  .options({
    extractCSS: true,
    loaders: {
      less: 'vue-style-loader!css-loader!less-loader'
    }
  })
  .end()

chainConfig
  .plugin('html-webpack-plugin')
  .use(HtmlWebpackPlugin, [
    {
      template: resolve('../public/index.html'),
      minify: {
        collapseWhitespace: true,
        removeComments: true
      },
      nodeModules: resolve('../node_modules')
    }
  ])
  .end()

chainConfig
  .plugin('clean')
  .use(CleanWebpackPlugin)
  .end()

const buildConfig = merge(baseConfig, chainConfig.toConfig())
module.exports = buildConfig
