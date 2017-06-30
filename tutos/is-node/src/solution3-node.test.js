// 'use strict'

/* global describe it */
const { expect } = require('chai')

const { isNode, isBrowser } = require('./lib/isnode')
// const isNode = function () { try { return this === global } catch (e) { return false } }
// const isBrowser = function () { try { return this === window } catch (e) { return false } }
// const isNode = function () { return !!(process !== undefined && process.versions && process.versions.node) }
// const isBrowser = function () { return !(process !== undefined && process.versions && process.versions.node) }
console.log(isNode(), isBrowser())

describe('is-node tests', () => {
  it('isNode should be true', () => {
    expect(isNode()).to.equal(true)
  })

  it('isBrowser should be false', () => {
    expect(isBrowser()).to.equal(false)
  })
})
