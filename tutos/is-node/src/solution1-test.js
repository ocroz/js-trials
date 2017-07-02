'use strict'

const { isNode, isBrowser } = require('./lib/isnode')

function testIsNode () {
  if (isBrowser()) {
    console.log('Running under browser')
  } else if (isNode()) {
    console.log('Running under node.js')
  } else {
    throw new Error('Unknown running context')
  }
}

module.exports = { testIsNode }
