require('browser-env')()

/* global describe it */
const { expect } = require('chai')

const { isNode, isBrowser } = require('./lib/isnode')
// const isNode = function () { try { return this === global } catch (e) { return false } }
// const isBrowser = function () { try { return this === window } catch (e) { return false } }
// const isNode = function () { return !!(process !== undefined && process.versions && process.versions.node) }
// const isBrowser = function () { return !(process !== undefined && process.versions && process.versions.node) }
console.log(isNode(), isBrowser())

describe('is-browser tests', () => {
  it('isBrowser should be true', () => {
    expect(isBrowser()).to.equal(true)
  })

  it('isNode should be false', () => {
    expect(isNode()).to.equal(false)
  })
})
