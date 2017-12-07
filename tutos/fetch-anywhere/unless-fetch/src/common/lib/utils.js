'use strict'

function nonVoids (input) {
  let output = {}
  for (let attr in input) {
    if (Object.keys(input[attr]).length > 0) { // input[attr] is either array or object
      output[attr] = input[attr]
    }
  }
  return output
}

module.exports = { nonVoids }
