'use strict'

const { getEnvAuth } = require('./env/index')
const { trycatch } = require('./lib/trycatch')
const { voneFetch, getWhoAmI } = require('./lib/vonefetch')

let auth = {}
async function main () {
  auth = await getEnvAuth()
  const memberId = await getWhoAmI(auth).then(whoami => whoami.split('/')[1])
  console.log('My memberId is:', memberId)

  auth = await getEnvAuth()
  const myself = await voneFetch(auth, 'GET', `rest-1.v1/Data/Member/${memberId}`).then(mydetails => mydetails.Attributes.Name.value)
  console.log('I am:', myself)

  auth = await getEnvAuth()
  const scope = await voneFetch(auth, 'GET', 'rest-1.v1/Data/Scope/0')
  console.log('Scope type is:', scope._type)

  auth = await getEnvAuth()
  const teams = await voneFetch(auth, 'GET', 'rest-1.v1/Data/Team?sel=Name,Inactive')
  console.log('Teams type is:', teams._type)
}

trycatch(main)
