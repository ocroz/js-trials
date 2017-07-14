#!node
'use strict'

const { assert } = require('chai')

// TEST THIS BLOCK
const { trycatch } = require('../src/lib/trycatch')
let gotit = false
async function main () {
  console.log('Hello')
  await timeout(500)
  gotit = true
}
trycatch(main)
// TEST THIS BLOCK

// The assert is asynchronous
testit()
console.log(gotit)
async function testit () {
  await timeout(1000)
  console.log(gotit)
  assert.equal(gotit, true)
}

// We add a delay to see how gotit changes over the time
async function timeout (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}
