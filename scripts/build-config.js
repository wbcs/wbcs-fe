const merge = require('webpack-merge')
const WebapckChain = require('webpack-chain')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const baseConfig = require('./base-config')

const chainConfig = new WebapckChain()

chainConfig.mode('production').end()
chainConfig.devtool('source-map').end()

chainConfig
  .plugin('clean')
  .use(CleanWebpackPlugin)
  .end()

chainConfig.optimization
  .minimizer('optimize-css')
  .use(OptimizeCSSAssetsPlugin)
  .use(TerserJSPlugin)
  .end()

module.exports = merge(baseConfig, chainConfig.toConfig())
