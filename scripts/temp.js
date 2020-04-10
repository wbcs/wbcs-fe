
const path = require('path')
const webpack = require('webpack')
const WebapckChain = require('webpack-chain')
const nodeExternals = require('webpack-node-externals')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const config = new WebapckChain()

config
  .context(path.resolve(__dirname, '../'))
  .entry('app')
  .add('src/renderer/main.js')
  .end()

config.output
  .path(path.resolve(__dirname, '../dist'))
  .filename('[name].[hash].js')
  .end()

config
  .externals([nodeExternals()])
  .end()

config.module
  .rule('images')
  .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
  .use('url-loader')
  .loader('url-loader')
  .options({
    limit: 1024,
    esModule: false,
    name: 'images/[name].[hash:7].[ext]'
  })
  .end()

/**
 * svg不适用inline
 * inline的svg会破坏svg片段标识符，它被用在雪碧图当中
 */
config.module
  .rule('svg')
  .test(/\.(svg|mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf)(\?.*)?$/)
  .use('file-loader')
  .loader('file-loader')
  .options({
    name: 'images/[name].[hash:7].[ext]',
    limit: 10000,
    esModule: false,
  })
  .end()

const lessLoaders = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: ['css-loader', 'less-loader']
})
const lessConfig = config.module
  .rule('less')
  .test(/\.(less)$/)
  // .use('extract-text-plugin-extract')

lessLoaders
  .reduce(
    (conf, { loader, options }) => conf
      .use(loader)
      .loader(loader)
      .options(options)
      .end(),
    lessConfig
  )
  // .end()

const cssLoaders = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: ['css-loader']
})
const cssConfig = config.module
  .rule('css')
  .test(/\.(css)$/)
  // .use('extract-text-plugin-extract')

cssLoaders
  .reduce(
    (conf, { loader, options }) => conf
      .use(loader)
      .loader(loader)
      .options(options)
      .end(),
    cssConfig
  )
  // .end()

config.module
  .rule('js')
  .test(/\.(js)$/)
  .use('babel')
  .loader('babel-loader')
  .end()

config.module
  .rule('vue')
  .test(/\.vue$/)
  .use('vue-loader')
  .options({
    extractCSS: process.env.NODE_ENV === 'production',
    loaders: {
      less: 'vue-style-loader!css-loader!less-loader'
    }
  })
  .end()

config
  .plugin('html-webpack-plugin')
  .use(HtmlWebpackPlugin, [
    {
      template: path.resolve(__dirname, '../public/index.html'),
      minify: {
        collapseWhitespace: true,
        removeComments: true
      },
      nodeModules:
        process.env.NODE_ENV !== 'production'
          ? path.resolve(__dirname, '../node_modules')
          : false
    }
  ])
  .end()

config
  .plugin('extract-text-plugin')
  .use(ExtractTextPlugin, ['style.css'])
  .end()

config
  .plugin('vue-loader-plugin')
  .use(VueLoaderPlugin)
  .end()

config
  .plugin('webpack-define-plugin')
  .use(webpack.DefinePlugin, [
    {
      __static: `"${path
        .join(__dirname, '../static')
        .replace(/\\/g, '\\\\')}"`
    }
  ])
  .end()

config
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

config.resolve.alias
  .set('@', path.resolve(__dirname, '../src/renderer'))
  .end()
  .extensions.add('.js')
  .add('.vue')
  .add('.json')
  .add('.less')
  .add('.css')
  .end()

config.devServer
  .set('port', 9080)
  // .set('quiet', true)
  .end()

console.log(config.toConfig())

module.exports = config.toConfig()
