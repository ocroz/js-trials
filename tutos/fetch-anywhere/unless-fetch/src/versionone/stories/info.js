'use strict'

const { getVoneConfig, contactVone, trycatch } = require('../env/index')

let voneConfig = {}
async function calls () {
  voneConfig = getVoneConfig()
  const memberId = await contactVone(voneConfig).then(whoami => whoami.split('/')[1])
  console.log('My memberId is:', memberId)

  voneConfig = getVoneConfig()
  const myself = await contactVone(voneConfig, 'GET', `rest-1.v1/Data/Member/${memberId}`).then(mydetails => mydetails.Attributes.Name.value)
  console.log('I am:', myself)

  voneConfig = getVoneConfig()
  const scope = await contactVone(voneConfig, 'GET', 'rest-1.v1/Data/Scope/0')
  console.log('Scope type is:', scope._type)

  voneConfig = getVoneConfig()
  const teams = await contactVone(voneConfig, 'GET', 'rest-1.v1/Data/Team?sel=Name,Inactive')
  console.log('Teams type is:', teams._type)
}

function main () {
  trycatch(calls)
}

module.exports = { main }
