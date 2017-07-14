#!node
'use strict'

/* global jest describe it */
const { expect } = require('chai')

const { trycatch } = require('../src/lib/trycatch')

let gotit = false
async function trycatchStandard () {
  async function main () {
    console.log('Hello')
    await timeout(1)
    gotit = true
  }
  trycatch(main)
}

describe('trycatch standard', () => {
  global.console = {
    log: jest.fn(),
    error: jest.fn()
  }
  it('should be true', async () => {
    trycatchStandard()
    console.log(gotit)
    await timeout(2)
    console.log(gotit)
    expect(gotit).to.equal(true)
  })
})

async function timeout (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}
