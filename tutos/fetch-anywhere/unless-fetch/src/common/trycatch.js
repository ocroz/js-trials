function trycatch (...args) {
  console.log('launching async processes')
  _trycatch(...args)
  console.log('async processes launched')
}

async function _trycatch (fn, cb) {
  try {
    await fn()
    console.log('async processes succeeded, nothing more to do, leaving script')
  } catch (err) {
    console.error('async processes failed with error:', err.message)
  }
  cb && cb()
}

module.exports = { trycatch }
