// standard errors
require('./standard-errors')

// breakline errors
require('./breakline-errors')

/* http://benalman.com/news/2013/01/advice-javascript-semicolon-haters/ */

// No multiple statements in declaration
const b = 1, c = 2, d = 3, e = 4

// No parenthesis at beginning of line
try {
  const a = b + c
  (d + e).print()            // TypeError: c is not a function

  console.log(a)
} catch (err) {
  console.log(err.message)
}

var obj = {
  prop: 'success',
  undefined: [{prop: 'fail'}]
}

var logProp = function (obj) {
  console.log(obj.prop)
}

logProp(obj)                 // 'success'
logProp(obj['undefined'][0]) // 'fail'

// No bracket at beginning of line
var a = obj
[a].forEach(logProp)         // 'fail'
