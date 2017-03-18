'use strict'

const resolve = require('path').resolve
const process = require('process')
const webpack = require('webpack')
const NotifierPlugin = require('webpack-notifier')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const appDir = resolve(__dirname, './app/src')

module.exports = {

  // https://github.com/webpack/webpack/issues/1599#issuecomment-186841345
  // __dirname returns '/' when js file is built with webpack
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },

  entry: {
    'index.js': './app/src/index.js',
    'entry.js': './app/src/entry.js',
  },

  devtool: "source-map",
  //devtool: 'cheap-module-source-map',
  //devtool: 'eval',

  output: {
    pathinfo: true,
    path: './app/dist',
    filename: '[name]',
    sourceMapFilename: '[name].map',
  },

  module: {
    preLoaders: [
      { test: /\.js$/, include: appDir, loader: 'eslint' },
    ],
    loaders: [
      { test: /\.json$/, include: appDir, loader: 'json' },
      { test: /\.js$/, include: appDir, loader: 'babel' },
      { test: /\.scss$/, include: appDir, loaders: ["style", "css?modules&sourceMap", "sass?sourceMap"] },
      { test: /.node$/, include: appDir, loader: 'node' },
      { test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=100000&name=[path][name].[ext]'}
    ]
  },
  resolve: {
    extensions: ['', '.js'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main'],
  },

  externals: [
    (ctx, req, cb) => {
      if (/^[electron|react|nodegit]/.test(req)) {
        return cb(null, `commonjs ${req}`)
      }
      cb()
    },
  ],

  plugins: [
    new NotifierPlugin({ alwaysNotify: true }),
    new webpack.NoErrorsPlugin(),
    new CopyWebpackPlugin([{
      from: resolve(appDir, 'index.html'),
      to: 'index.html'
    }, {
      from: resolve(appDir, 'assets/logo/'),
      to: 'assets/logo/'
    }, {
      from: resolve(appDir, '../package.json'),
      to: 'package.json'
    }, {
      from: resolve(appDir, '../node_modules/'),
      to: 'node_modules/'
    }]),
    new webpack.ProvidePlugin({
      Promise: 'bluebird',
    }),
    new webpack.DefinePlugin({
      __DEVTOOLS__: false,  // <-------- DISABLE redux-devtools HERE
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
  ],
}
