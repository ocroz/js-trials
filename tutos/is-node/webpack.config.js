const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './src/solution2.js',
  output: {
    filename: 'solution2-webpack.js',
    path: path.resolve(__dirname, 'bundle')
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve('./src'),
        loader: 'babel-loader',
        query: require('./babelrc.js')
      }
    ]
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({ compress: false, mangle: false, output: {beautify: true, indent_level: 2} })
  ]
}
