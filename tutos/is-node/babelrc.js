module.exports = {
  presets: [
    [ 'env', {
      targets: { browsers: ['> 5%', 'last 2 versions', 'ie 11'] }
      // targets: { browsers: ['last 1 version'] }
      // targets: { node: 'current' }
    } ]
  ]
}
