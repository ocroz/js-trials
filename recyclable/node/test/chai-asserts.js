#!node
'use strict'

const { assert } = require('chai')

const foo = 'bar'
const tea = { flavors: [ 'green', 'black', 'red' ] }

console.log('testing', foo, tea, '...')

assert.typeOf(foo, 'string')
assert.equal(foo, 'bar')
assert.lengthOf(foo, 3)
assert.property(tea, 'flavors')
assert.lengthOf(tea.flavors, 3)

console.log('OK')
