const createBabelConfig = require('./babelrc')
const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

const PRODUCTION = process.env.NODE_ENV === 'production'
const MinifierPlugin = webpack.optimize.UglifyJsPlugin

const clientConfig = {
  entry: path.resolve('./src/index.browser.js'),
  output: {
    path: path.resolve('./dist'),
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve('./src'),
        loader: 'babel-loader',
        query: createBabelConfig()
      }
    ]
  },

  plugins: [
    PRODUCTION && new MinifierPlugin()
  ].filter(e => e)
}

const serverConfig = {
  target: 'node',
  externals: [ nodeExternals() ],

  node: {
    __dirname: true
  },

  entry: path.resolve('./src/index.server.js'),
  output: {
    path: path.resolve('./dist'),
    filename: 'server.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve('./src'),
        loader: 'babel-loader',
        query: createBabelConfig({ server: true })
      }
    ]
  },

  plugins: [
    PRODUCTION && new MinifierPlugin()
  ].filter(e => e)
}

// Notice that both configurations are exported
module.exports = [clientConfig, serverConfig]
