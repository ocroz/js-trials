'use strict'

function isNode () { return true }
function isBrowser () { return false }

module.exports = { isNode, isBrowser }
