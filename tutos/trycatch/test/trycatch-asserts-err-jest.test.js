#!node
'use strict'

/* global jest describe it beforeEach afterEach */
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const expect = chai.expect

chai.use(sinonChai)

const { trycatch } = require('../src/lib/trycatch')

async function trycatchError () {
  async function main () {
    const err = { message: 'main threw error' }
    throw err
  }
  trycatch(main)
}

describe('trycatch error', () => {
  const oriConsole = global.console

  beforeEach(() => {
    global.console = {
      log: jest.fn(),
      error: jest.fn()
    }
  })

  afterEach(() => {
    global.console = oriConsole
  })

  // console.log('Hello!')

  it('should throw error', async () => {
    sinon.spy(console, 'error')
    trycatchError()
    await timeout(2)
    expect(console.error).to.have.been.calledWith('async processes failed with error:', 'main threw error')
    console.error.restore()
  })

  // console.log('Hello again!')
})

async function timeout (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}
