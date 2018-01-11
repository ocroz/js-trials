'use strict'

function nonVoids (input) {
  let output = {}
  for (let attr in input) {
    if (input[attr] && Object.keys(input[attr]).length > 0) { // if defined, input[attr] is either array or object or string
      output[attr] = input[attr]
    }
  }
  return output
}

module.exports = { nonVoids }
