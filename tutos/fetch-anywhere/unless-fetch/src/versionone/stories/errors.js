'use strict'

const { getVoneConfig, contactVone, trycatch } = require('../env/index')

let voneConfig = {}
let memberId, myself, authHeader
let runErrors = false

async function connect () {
  voneConfig = getVoneConfig()
  memberId = await contactVone(voneConfig).then(whoami => whoami.split('/')[1])
  console.log('My memberId is:', memberId)

  authHeader = await voneConfig.getAuthHeader() // Get a NTLM token...
  voneConfig = getVoneConfig()
  voneConfig.getAuthHeader = () => authHeader // ...and consume it (see error4 below)
  myself = await contactVone(voneConfig, 'GET', `rest-1.v1/Data/Member/${memberId}`).then(mydetails => mydetails.Attributes.Name.value)
  console.log('I am:', myself)

  runErrors = true
}

async function error1 () {
  voneConfig = getVoneConfig()
  voneConfig.voneUrl = 'https://safefake.com/Safefake' // bad url
  const scope = await contactVone(voneConfig, 'GET', 'rest-1.v1/Data/Scope/0')
  console.log('Scope type is:', scope._type)
}

async function error2 () { // produces an error in node only (excepted with httpntlm) => this passes in the browser
  voneConfig = getVoneConfig()
  voneConfig.agent = undefined // missing agent for http or https
  const scope = await contactVone(voneConfig, 'GET', 'rest-1.v1/Data/Scope/0')
  console.log('Scope type is:', scope._type)
}

async function error3 () { // produces an error in node only => this passes in the browser
  voneConfig = getVoneConfig()
  let authOpts = voneConfig.getAuthOpts()
  Object.keys(authOpts).map(key => { authOpts[key] = '' })
  voneConfig.getAuthOpts = () => authOpts // bad credentials for node httpntlm lib
  voneConfig.getAuthHeader = () => undefined // bad credentials for other node libs
  const scope = await contactVone(voneConfig, 'GET', 'rest-1.v1/Data/Scope/0')
  console.log('Scope type is:', scope._type)
}

async function error4 () { // produces an error in node only (excepted with httpntlm) => this passes in the browser
  voneConfig = getVoneConfig()
  voneConfig.getAuthHeader = () => authHeader // We don't get any new NTLM token
  const teams = await contactVone(voneConfig, 'GET', 'rest-1.v1/Data/Team?sel=Name,Inactive')
  console.log('Teams type is:', teams._type) // This fails because the NTLM token was consumed already
}

async function error5 () {
  voneConfig = getVoneConfig()
  const teams = await contactVone(voneConfig, 'GET', 'rest-1.v1/Data/_Team_') // bad api
  console.log('Teams type is:', teams._type)
}

async function error6 () {
  voneConfig = getVoneConfig()
  const memberId = await contactVone(voneConfig, 'GET', 'rest-1.v1/Data/Member/_0000_') // bad memberId
  console.log('I am:', memberId.Attributes.Name.value)
}

async function error7 () {
  voneConfig = getVoneConfig()
  const memberId = await contactVone(voneConfig, 'GET', 'rest-1.v1/Data/Member/0000') // unknown memberId
  console.log('I am:', memberId.Attributes.Name.value)
}

async function error8 () {
  voneConfig = getVoneConfig()
  const memberId = await contactVone(voneConfig, 'DELETE', 'rest-1.v1/Data/Member/0000') // bad method
  console.log('I am:', memberId.Attributes.Name.value)
}

async function error9 () {
  voneConfig = getVoneConfig()
  const memberId = await contactVone(voneConfig, 'POST', 'rest-1.v1/Data/Member/0000') // missing body
  console.log('I am:', memberId.Attributes.Name.value)
}

async function error10 () {
  voneConfig = getVoneConfig()
  const memberId = await contactVone(voneConfig, 'POST', 'rest-1.v1/Data/Member/0000', { // unknown memberId
    Attributes: {
      Name: { value: 'Andre Agile', act: 'set' }
    }
  })
  console.log('I am:', memberId.Attributes.Name.value)
}

async function error11 () {
  voneConfig = getVoneConfig()
  const memberId = await contactVone(voneConfig, 'POST', 'rest-1.v1/Data/Member', {
    Attributes: {
      Name: { value: 'Andre Agile', act: 'set' } // missing default role
    }
  })
  console.log('I am:', memberId.Attributes.Name.value)
}

async function error12 () {
  voneConfig = getVoneConfig()
  const memberId = await contactVone(voneConfig, 'POST', 'rest-1.v1/Data/Member', {
    Attributes: {
      // Name: { value: 'Andre Agile', act: 'set' },
      DefaultRole: { value: { 'href': '/Safetest/rest-1.v1/Data/Role/4', 'idref': 'Role:4' }, act: 'set' } // missing NickName
    }
  })
  console.log('I am:', memberId.Attributes.Name.value)
}

async function error13 () {
  voneConfig = getVoneConfig()
  const memberId = await contactVone(voneConfig, 'POST', 'rest-1.v1/Data/Member', {
    Attributes: {
      _Name_: { value: 'Andre Agile', act: 'set' }, // bad key
      DefaultRole: { value: { 'href': '/Safetest/rest-1.v1/Data/Role/4', 'idref': 'Role:4' }, act: 'set' }
    }
  })
  console.log('I am:', memberId.Attributes.Name.value)
}

function main () {
  trycatch(connect, errors)
}

function errors () {
  const tcerr1 = () => trycatch(error1, tcerr2)
  const tcerr2 = () => trycatch(error2, tcerr3)
  const tcerr3 = () => trycatch(error3, tcerr4)
  const tcerr4 = () => trycatch(error4, tcerr5)
  const tcerr5 = () => trycatch(error5, tcerr6)
  const tcerr6 = () => trycatch(error6, tcerr7)
  const tcerr7 = () => trycatch(error7, tcerr8)
  const tcerr8 = () => trycatch(error8, tcerr9)
  const tcerr9 = () => trycatch(error9, tcerr10)
  const tcerr10 = () => trycatch(error10, tcerr11)
  const tcerr11 = () => trycatch(error11, tcerr12)
  const tcerr12 = () => trycatch(error12, tcerr13)
  const tcerr13 = () => trycatch(error13)
  if (runErrors) { tcerr1() }
}

module.exports = { main }
