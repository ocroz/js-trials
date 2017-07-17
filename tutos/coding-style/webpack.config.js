const path = require('path')
module.exports = {
  entry: { main: './src/coding-style-errors.js' },
  output: { filename: './dist/bundle.js' },
  module: {
    rules: [{
      test: /\.js$/,
      include: [ path.resolve(__dirname, './src') ],
      loader: 'eslint-loader', // eslint uses the defined configuration
      exclude: /node_modules/,
      enforce: 'pre', // run eslint before any other webpack actions
      options: { fix: false } // don't autofix the javascript code
    }]
  }
}
