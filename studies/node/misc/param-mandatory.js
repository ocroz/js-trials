#!node
'use strict'
console.log('Hello!')

function required (arg) {
  throw new Error(`'${arg}' is undefined`)
}

class ParamMandatory {
  constructor (param = required('param')) {
    this.param = param
  }
  print () {
    console.log(this.param)
  }
}

function createObject (param) {
  try {
    // const myParam = new paramMandatory(param)
    // myParam.print()
    const { param: myParam } = new ParamMandatory(param)
    console.log(myParam)
  } catch (err) {
    console.log(err)
  }
}

createObject(1)
createObject()

console.log('Terminating')
