'use strict'

const { getEnvAuth } = require('./env/index')
const { trycatch } = require('./lib/trycatch')
const { voneFetch, getWhoAmI } = require('./lib/vonefetch')

let auth = {}
let memberId, myself

async function connect () {
  auth = await getEnvAuth()
  memberId = await getWhoAmI(auth).then(whoami => whoami.split('/')[1])
  console.log('My memberId is:', memberId)

  auth = await getEnvAuth()
  myself = await voneFetch(auth, 'GET', `rest-1.v1/Data/Member/${memberId}`).then(mydetails => mydetails.Attributes.Name.value)
  console.log('I am:', myself)

  errors()
}

async function error1 () {
  auth = await getEnvAuth('http://safefake.com/Safefake') // bad url
  const scope = await voneFetch(auth, 'GET', 'rest-1.v1/Data/Scope/0')
  console.log('Scope type is:', scope._type)
}

async function error2 () {
  auth = await getEnvAuth()
  auth.agent = undefined // missing agent for http or https
  const scope = await voneFetch(auth, 'GET', 'rest-1.v1/Data/Scope/0')
  console.log('Scope type is:', scope._type)
}

async function error3 () {
  auth = await getEnvAuth()
  auth.credentials = 'undefined' // bad credentials
  const scope = await voneFetch(auth, 'GET', 'rest-1.v1/Data/Scope/0')
  console.log('Scope type is:', scope._type)
}

async function error4 () {
  // auth = await getEnvAuth() // We don't get any new NTLM token
  const teams = await voneFetch(auth, 'GET', 'rest-1.v1/Data/Team?sel=Name,Inactive')
  console.log('Teams type is:', teams._type) // This fails because the NTLM token was consumed already
}

async function error5 () {
  auth = await getEnvAuth()
  const teams = await voneFetch(auth, 'GET', 'rest-1.v1/Data/_Team_') // bad api
  console.log('Teams type is:', teams._type)
}

async function error6 () {
  auth = await getEnvAuth()
  const memberId = await voneFetch(auth, 'GET', 'rest-1.v1/Data/Member/_0000_') // bad memberId
  console.log('I am:', memberId.Attributes.Name.value)
}

async function error7 () {
  auth = await getEnvAuth()
  const memberId = await voneFetch(auth, 'GET', 'rest-1.v1/Data/Member/0000') // unknown memberId
  console.log('I am:', memberId.Attributes.Name.value)
}

async function error8 () {
  auth = await getEnvAuth()
  const memberId = await voneFetch(auth, 'DELETE', 'rest-1.v1/Data/Member/0000') // bad method
  console.log('I am:', memberId.Attributes.Name.value)
}

async function error9 () {
  auth = await getEnvAuth()
  const memberId = await voneFetch(auth, 'POST', 'rest-1.v1/Data/Member/0000') // missing body
  console.log('I am:', memberId.Attributes.Name.value)
}

async function error10 () {
  auth = await getEnvAuth()
  const memberId = await voneFetch(auth, 'POST', 'rest-1.v1/Data/Member/0000', { // unknown memberId
    Attributes: {
      Name: { value: 'Andre Agile', act: 'set' }
    }
  })
  console.log('I am:', memberId.Attributes.Name.value)
}

async function error11 () {
  auth = await getEnvAuth()
  const memberId = await voneFetch(auth, 'POST', 'rest-1.v1/Data/Member', {
    Attributes: {
      Name: { value: 'Andre Agile', act: 'set' } // missing default role
    }
  })
  console.log('I am:', memberId.Attributes.Name.value)
}

async function error12 () {
  auth = await getEnvAuth()
  const memberId = await voneFetch(auth, 'POST', 'rest-1.v1/Data/Member', {
    Attributes: {
      // Name: { value: 'Andre Agile', act: 'set' },
      DefaultRole: { value: { 'href': '/Safetest/rest-1.v1/Data/Role/4', 'idref': 'Role:4' }, act: 'set' } // missing NickName
    }
  })
  console.log('I am:', memberId.Attributes.Name.value)
}

async function error13 () {
  auth = await getEnvAuth()
  const memberId = await voneFetch(auth, 'POST', 'rest-1.v1/Data/Member', {
    Attributes: {
      _Name_: { value: 'Andre Agile', act: 'set' }, // bad key
      DefaultRole: { value: { 'href': '/Safetest/rest-1.v1/Data/Role/4', 'idref': 'Role:4' }, act: 'set' }
    }
  })
  console.log('I am:', memberId.Attributes.Name.value)
}

trycatch(connect)

function errors () {
  trycatch(error1)
  trycatch(error2)
  trycatch(error3)
  trycatch(error4)
  trycatch(error5)
  trycatch(error6)
  trycatch(error7)
  trycatch(error8)
  trycatch(error9)
  trycatch(error10)
  trycatch(error11)
  trycatch(error12)
  trycatch(error13)
}
