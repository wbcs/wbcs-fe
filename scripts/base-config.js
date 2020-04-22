const webpack = require('webpack')
const WebapckChain = require('webpack-chain')
const nodeExternals = require('webpack-node-externals')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const { resolve } = require('./utils')

const __DEV__ = process.env.NODE_ENV === 'development'

const chainConfig = new WebapckChain()

chainConfig
  .context(resolve('../'))
  .entry('app')
  .add('./src/renderer/main.js')
  .end()

chainConfig.output
  .path(resolve('../dist/web'))
  .filename('js/[name].[hash:7].js')
  .end()

chainConfig.externals([nodeExternals()]).end()

chainConfig.module
  .rule('vue')
  .test(/\.vue$/)
  .use('vue-loader')
  .loader('vue-loader')
  .end()

chainConfig.module
  .rule('less')
  .test(/\.(less|css)$/)
  .use('mini-css-extract-loader')
  .loader(__DEV__ ? 'style-loader' : MiniCssExtractPlugin.loader)
  .options({
    publicPath: '../'
  })
  .end()
  .use('css-loader')
  .loader('css-loader')
  .end()
  .use('less-loader')
  .loader('less-loader')
  .end()

chainConfig.module
  .rule('images')
  .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
  .use('url-loader')
  .loader('url-loader')
  .options({
    limit: 1024 * 1000,
    esModule: false,
    name: 'img/[name].[hash:7].[ext]'
  })
  .end()

/**
 * svg不适用inline
 * inline的svg会破坏svg片段标识符，它被用在雪碧图当中
 */
chainConfig.module
  .rule('svg')
  .test(/\.(svg)$/)
  .use('file-loader')
  .loader('file-loader')
  .options({
    name: 'img/[name].[hash:7].[ext]',
    limit: 1024,
    esModule: false
  })
  .end()

chainConfig.module
  .rule('file')
  .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf)(\?.*)?$/)
  .use('file-loader')
  .loader('file-loader')
  .options({
    name: 'file/[name].[hash:7].[ext]',
    limit: 1024,
    esModule: false
  })
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
  .plugin('min-cess-extract-plugin')
  .use(MiniCssExtractPlugin, [
    {
      filename: 'css/[name].[hash:7].css',
      chunkFilename: 'css/[name].[hash:7].css',
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
