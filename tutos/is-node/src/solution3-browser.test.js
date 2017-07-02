// load isNode and isBrowser first or their values are wrong
const { isNode, isBrowser } = require('./solution3')
console.log('isBrowser =', isBrowser(), ', isNode =', isNode(), '.')

/* global describe it */
const { expect } = require('chai')

describe('is-browser tests', () => {
  it('isBrowser should be true', () => {
    expect(isBrowser()).to.equal(true)
  })

  it('isNode should be true too', () => {
    expect(isNode()).to.equal(true)
  })
})
