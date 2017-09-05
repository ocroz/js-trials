const path = require('path')
const webpack = require('webpack')

module.exports = {
  context: path.resolve(__dirname, './src/client'),

  entry: {
    app: './index.jsx'
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './public')
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' })
  ]
}

// Add babel for the code compatibility in various browsers (see babelrc.js) and for the uglify plugin to function
module.exports.module = {
  rules: [
    {
      test: /\.jsx$/,
      include: path.resolve('./src/client'),
      loader: 'babel-loader',
      query: require('./babelrc.js')
    }
  ]
}
