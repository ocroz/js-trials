// load isNode and isBrowser first or their values are wrong
const { isNode, isBrowser } = require('./lib/index')

// load ./lib/browser instead of ./lib/index as previously required
/* global jest */
jest.mock('./lib/index', () => {
  return require('./lib/browser')
})

console.log('isBrowser =', isBrowser(), ', isNode =', isNode(), '.')

/* global describe it */
const { expect } = require('chai')

describe('is-browser tests', () => {
  it('isBrowser should be true', () => {
    expect(isBrowser()).to.equal(true)
  })

  it('isNode should be false', () => {
    expect(isNode()).to.equal(false)
  })
})
