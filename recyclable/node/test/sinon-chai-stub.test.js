#!node
'use strict'

/* global describe it afterEach */
const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect
chai.use(require('sinon-chai'))

const toBeStubbed = {
  syncData () {
    return { stub: false }
  },
  async asyncData () {
    return Promise.resolve({ stub: false })
  }
}

describe('stubbing', () => {
  const sandbox = sinon.sandbox.create()

  afterEach(() => {
    sandbox.restore()
  })

  it('should return syncData', () => {
    const obj = toBeStubbed.syncData()
    expect(obj).to.deep.equal({ stub: false })
  })

  it('should return stubbed data but syncData', () => {
    sandbox.stub(toBeStubbed, 'syncData').returns({ stub: true })
    const obj = toBeStubbed.syncData()
    expect(obj).to.deep.equal({ stub: true })
  })

  it('should return unresolved/pending promise but asyncData', () => {
    const obj = toBeStubbed.asyncData()
    .then((data) => {
      expect(data).to.be.a('promise')
    })
    .catch((err) => {
      expect(err).to.be.a('object')
    })
    sandbox.stub(console, 'log').returns(undefined)
    console.log(obj)
  })

  it('should return asyncData', async () => {
    const obj = await toBeStubbed.asyncData()
    expect(obj).to.deep.equal({ stub: false })
  })

  it('should return stubbed data but asyncData', async () => {
    sandbox.stub(toBeStubbed, 'asyncData').returns({ stub: true })
    const obj = await toBeStubbed.asyncData()
    expect(obj).to.deep.equal({ stub: true })
  })
})
