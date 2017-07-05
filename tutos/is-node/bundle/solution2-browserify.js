(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

function isNode () { return false }
function isBrowser () { return true }

module.exports = { isNode, isBrowser }

},{}],2:[function(require,module,exports){
'use strict'

const { isNode, isBrowser } = require('./lib/index')

function testIsNode () {
  if (isBrowser()) {
    console.log('Running under browser')
  } else if (isNode()) {
    console.log('Running under node.js')
  } else {
    throw new Error('Unknown running context')
  }
}

module.exports = { testIsNode }

},{"./lib/index":1}],3:[function(require,module,exports){
'use strict'

const { testIsNode } = require('./solution2-test')

testIsNode()

},{"./solution2-test":2}]},{},[3]);
