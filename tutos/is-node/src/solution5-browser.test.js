/* global describe it beforeEach isBrowser isNode */
const { expect } = require('chai')
const path = require('path')
const Nightmare = require('nightmare')

describe('test is-node', () => {
  let page
  beforeEach(() => {
    page = Nightmare().goto('file:' + path.resolve(__dirname, '../bundle') + '/solution1.html')
  })

  it('title should be "is-node solution1"', (done) => {
    page.evaluate(() => {
      expect(document.title).to.equal('is-node solution1')
    }).end(done())
  })

  it('isBrowser should be true', (done) => {
    page.evaluate(() => {
      expect(isBrowser()).to.equal(true) // run function isBrowser() as if within the html page
    }).end(done())
  })

  it('isNode should be false', (done) => {
    page.evaluate(() => {
      expect(isNode()).to.equal(false) // run function isNode() as if within the html page
    }).end(done())
  })
})
