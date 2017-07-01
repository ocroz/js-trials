// load isNode and isBrowser first or their values are wrong
const { isNode, isBrowser } = require('./lib/index')
console.log('isBrowser =', isBrowser(), ', isNode =', isNode(), '.')

/* global describe it */
const { expect } = require('chai')

describe('is-node tests', () => {
  it('isNode should be true', () => {
    expect(isNode()).to.equal(true)
  })

  it('isBrowser should be false', () => {
    expect(isBrowser()).to.equal(false)
  })
})
