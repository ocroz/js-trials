#!node
'use strict'

/* global describe it */
// this defines describe and it functions, see:
// https://facebook.github.io/jest/docs/api.html
const { expect } = require('chai')

const foo = 'bar'
const tea = { flavors: [ 'green', 'black', 'red' ] }

describe('Custom assertions', () => {
  it('should be string', () => {
    expect(foo).to.be.a('string')
  })

  it('should be string', () => {
    expect(foo).to.be.a('string')
  })

  it('should equal', () => {
    expect(foo).to.equal('bar')
  })

  it('should have length', () => {
    expect(foo).to.have.length(3)
  })

  it('should have property with length', () => {
    expect(tea).to.have.property('flavors').with.length(3)
  })
})
