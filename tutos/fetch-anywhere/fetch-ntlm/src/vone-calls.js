'use strict'

const { getEnvAuth } = require('./env/index')
const { trycatch } = require('./lib/trycatch')
const { voneFetch } = require('./lib/vonefetch')

let auth = {}
async function main () {
  auth = await getEnvAuth()
  const { myself, data: scope } = await voneFetch(auth, 'GET', 'rest-1.v1/Data/Scope/0')
  console.log('Scope type is:', scope._type)

  auth = await getEnvAuth()
  const mydetails = await voneFetch(auth, 'GET', 'rest-1.v1/Data/Member/' + myself.split('/')[1]).then(res => res.data)
  console.log('I am:', mydetails.Attributes.Name.value)

  // auth = await getEnvAuth() // We don't get any new NTLM token
  const teams = await voneFetch(auth, 'GET', 'rest-1.v1/Data/Team?sel=Name,Inactive').then(res => res.data)
  console.log('Teams type is:', teams._type) // This fails because the NTLM token was consumed already
}

trycatch(main)
