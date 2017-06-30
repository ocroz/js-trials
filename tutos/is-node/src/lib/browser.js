'use strict'

function isNode () { return false }
function isBrowser () { return true }

module.exports = { isNode, isBrowser }
