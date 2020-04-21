const webpack = require('webpack')
const WebapckChain = require('webpack-chain')
const nodeExternals = require('webpack-node-externals')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const { resolve, useStylesLoader } = require('./utils')

const __DEV__ = process.env.NODE_ENV === 'development'

const chainConfig = new WebapckChain()

chainConfig
  .context(resolve('../'))
  .entry('app')
  .add('./src/renderer/main.js')
  .end()

chainConfig.output
  .path(resolve('../dist'))
  .filename('[name].[hash].js')
  .end()

chainConfig.externals([nodeExternals()]).end()

chainConfig.module
  .rule('vue')
  .test(/\.vue$/)
  .use('vue-loader')
  .loader('vue-loader')
  .options({
    extractCSS: !__DEV__,
    loaders: ['vue-style-loader', 'css-loader', 'less-loader']
  })
  .end()

ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: ['css-loader', 'less-loader'],
  publicPath: ''
}).reduce(
  useStylesLoader,
  chainConfig.module.rule('less').test(/\.(less)$/)
)

ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: ['css-loader'],
  publicPath: ''
}).reduce(useStylesLoader, chainConfig.module.rule('css').test(/\.(css)$/))

chainConfig.module
  .rule('images')
  .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
  .use('url-loader')
  .loader('url-loader')
  .options({
    limit: 1024,
    esModule: false,
    publicPath: '/',
    name: 'images/[name].[hash:7].[ext]'
  })
  .end()

/**
 * svg不适用inline
 * inline的svg会破坏svg片段标识符，它被用在雪碧图当中
 */
chainConfig.module
  .rule('svg')
  .test(/\.(svg|mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf)(\?.*)?$/)
  .use('file-loader')
  .loader('file-loader')
  .options({
    name: 'images/[name].[hash:7].[ext]',
    limit: 10000,
    esModule: false
  })
  .end()

chainConfig
  .plugin('extract-text-plugin')
  .use(ExtractTextPlugin, ['style.[hash].css'])
  .end()

chainConfig
  .plugin('vue-loader-plugin')
  .use(VueLoaderPlugin)
  .end()

chainConfig
  .plugin('webpack-define-plugin')
  .use(webpack.DefinePlugin, [
    {
      __DEV__
    }
  ])
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
      nodeModules: __DEV__ ? false : resolve('../node_modules')
    }
  ])
  .end()

chainConfig.resolve.alias
  .set('@', resolve('../src/renderer'))
  .end()
  .extensions.add('.js')
  .add('.vue')
  .add('.json')
  .add('.less')
  .add('.css')
  .end()

chainConfig.target('electron-renderer').end()

const config = chainConfig.toConfig()
module.exports = config
