const path = require('path')
// const webpack = require('webpack')

module.exports = {
  entry: './src/solution2.js',
  output: {
    filename: 'solution2.js',
    path: path.resolve(__dirname, 'bundle')
  },
  module: {
    preLoaders: [
      {
        test: /\.(js|css)$/,
        loader: 'stripcomments?-lines'
      }
    ]
  } // ,
  // plugins: [
    // This one does nothing: webpack uses the browser setting in package.json
  //   new webpack.NormalModuleReplacementPlugin(new RegExp('./src/lib/index.js'), './src/lib/browser.js'),
    // This one makes the build to fail
  //   new webpack.optimize.UglifyJsPlugin({ output: {beautify: true, comments: false, mangle: false} })
  // ]
}
