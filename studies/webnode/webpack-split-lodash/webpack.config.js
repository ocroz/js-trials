// https://webpack.js.org/guides/getting-started/
const webpack = require('webpack')
const path = require('path')

// https://webpack.js.org/plugins/commons-chunk-plugin/#explicit-vendor-chunk
module.exports = {
  entry: {
    app: './src/index.js',
    vendor: ['lodash']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js' })
  ]
}
