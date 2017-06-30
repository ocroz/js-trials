'use strict'

const { isNode, isBrowser } = require('./lib/index')
const { trycatch } = require('./lib/trycatch')

async function main () {
  'use strict'
  if (isBrowser()) {
    console.log('Running under browser')
  } else if (isNode()) {
    console.log('Running under node.js')
  } else {
    throw new Error('Unknown running context')
  }
}

trycatch(main)
