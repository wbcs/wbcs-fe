const path = require('path')
const webpack = require('webpack')
const WebapckChain = require('webpack-chain')
const nodeExternals = require('webpack-node-externals')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { resolve } = require('./utils')

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

chainConfig.output
  .publicPath('./')
  .end()

chainConfig.externals([nodeExternals()]).end()

const lessLoaders = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: ['css-loader', 'less-loader']
})
const lessConfig = chainConfig.module.rule('less').test(/\.(less)$/)

lessLoaders.reduce(
  (conf, { loader, options }) =>
    conf
      .use(loader)
      .loader(loader)
      .options(options)
      .end(),
  lessConfig
)

const cssLoaders = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: ['css-loader']
})
const cssConfig = chainConfig.module.rule('css').test(/\.(css)$/)

cssLoaders.reduce(
  (conf, { loader, options }) =>
    conf
      .use(loader)
      .loader(loader)
      .options(options)
      .end(),
  cssConfig
)

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
  .use(ExtractTextPlugin, ['style.css'])
  .end()

chainConfig
  .plugin('vue-loader-plugin')
  .use(VueLoaderPlugin)
  .end()

chainConfig
  .plugin('webpack-define-plugin')
  .use(webpack.DefinePlugin, [
    {
      __static: `"${path
        .join(__dirname, '../static')
        .replace(/\\/g, '\\\\')}"`
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
