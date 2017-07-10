const path = require('path')
const webpack = require('webpack')
const isDev = (process.env.NODE_ENV === 'dev')

module.exports = {
  context: path.resolve(__dirname, './src'),

  entry: {
    main: './solution2.js'
  },

  output: {
    filename: 'solution2-webpack-[name].js',
    path: path.resolve(__dirname, './bundle')
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'modules' })
  ]
}

if (!isDev) {
  // Add babel for the code compatibility in various browsers (see babelrc.js) and for the uglify plugin to function
  module.exports.module = {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve('./src'),
        loader: 'babel-loader',
        query: require('./babelrc.js')
      }
    ]
  }

  // !isProduction: Only remove comments
  //  isProduction: 'webpack -p' always runs new webpack.optimize.UglifyJsPlugin() with all compressor options
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({ compress: false, mangle: false, output: {beautify: true, indent_level: 2} })
  )
}
