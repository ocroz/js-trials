'use strict'

const { getEnvAuth } = require('./env/index')
const { trycatch } = require('./lib/trycatch')
const { voneFetch } = require('./lib/vonefetch')

let auth = {}
async function main () {
  auth = await getEnvAuth()
  const teams = await voneFetch(auth, 'GET', 'rest-1.v1/Data/Team?sel=Name,Inactive')
  console.log('Teams are:', teams._type)

  // auth = await getEnvAuth()
  const scope = await voneFetch(auth, 'GET', 'rest-1.v1/Data/Scope/0')
  console.log('Scope is:', scope._type)
}

trycatch(main)
