process.env.BABEL_ENV = 'main'

const path = require('path')
const webpack = require('webpack')
const BabiliWebpackPlugin = require('babili-webpack-plugin')
const { dependencies } = require('../package.json')

const config = {
  entry: path.join(__dirname, '../src/main/index.js'),
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [],
  resolve: {
    extensions: ['.js', '.json'],
  },
  devServer: {
    port: 9080
  },
  target: 'electron-main'
}


// const config = {
//   entry: path.join(__dirname, '../src/main/index.js'),
//   externals: [...Object.keys(dependencies || {})],
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         use: 'babel-loader',
//         exclude: /node_modules/
//       },
//       {
//         test: /\.node$/,
//         use: 'node-loader'
//       }
//     ]
//   },
//   node: {
//     __dirname: process.env.NODE_ENV !== 'production',
//     __filename: process.env.NODE_ENV !== 'production'
//   },
//   output: {
//     filename: '[name].js',
//     libraryTarget: 'commonjs2',
//     path: path.join(__dirname, '../dist/electron')
//   },
//   plugins: [new webpack.NoEmitOnErrorsPlugin()],
//   resolve: {
//     extensions: ['.js', '.json', '.node']
//   },
//   target: 'electron-main'
// }

/**
 * Adjust config for development settings
 */
if (process.env.NODE_ENV !== 'production') {
  config.plugins.push(
    new webpack.DefinePlugin({
      __static: `"${path
        .join(__dirname, '../static')
        .replace(/\\/g, '\\\\')}"`
    })
  )
}

/**
 * Adjust config for production settings
 */
if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new BabiliWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  )
}

module.exports = config
