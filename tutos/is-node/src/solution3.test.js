const solution2 = require('../bundle/solution2')
console.log(solution2)

/* global describe it afterEach */
const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect
chai.use(require('sinon-chai'))

describe('is-browser tests', () => {
  const sandbox = sinon.sandbox.create()

  afterEach(() => {
    sandbox.restore()
  })

  it('isBrowser should be true', () => {
    let solution2 = {}
    const spy = sandbox.spy(solution2, 'isBrowser')
    solution2 = require('../bundle/solution2')
    expect(spy).to.return(true)
  })

  it('isNode should be false', () => {
    let solution2 = {}
    const spy = sandbox.spy(solution2, 'isNode')
    solution2 = require('../bundle/solution2')
    expect(spy).to.return(false)
  })
})
