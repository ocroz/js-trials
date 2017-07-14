// No breakline after return
function bad1 () {
  return
  2
}

function bad2 () {
  let i = 1
  return
  (i = 2)
}

console.log(bad1(), bad2())   // undefined undefined

// No multiple statements in declaration
const b = 1, c = 2, d = 3, e = 4

// No parenthesis at beginning of line
const a = b + c
(d + e).print()              // TypeError: c is not a function

console.log(a)

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
var o = obj
[o].forEach(logProp)         // 'fail'
