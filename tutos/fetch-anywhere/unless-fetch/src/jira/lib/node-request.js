'use strict'

const request = require('request')

async function requestJira (jiraConfig = {}, method = 'GET', req = 'api/2/myself', input) {
  // jiraConfig = {jiraUrl, getAuthHeader, agent, nonVoids}
  for (let attr of ['jiraUrl', 'getAuthHeader', 'nonVoids']) {
    if (!jiraConfig[attr]) { throw new Error(`requestJira: ${attr} is undefined`) }
  }

  // request parameters
  const url = jiraConfig.jiraUrl + '/rest/' + req
  const body = input && JSON.stringify(input)
  const authHeader = jiraConfig.getAuthHeader(url, method)
  const headers = authHeader
    ? { 'Accept': 'application/json', 'Content-Type': 'application/json', [authHeader.name]: authHeader.data }
    : { 'Accept': 'application/json', 'Content-Type': 'application/json' }
  // console.log(url, method, body, headers, jiraConfig.agent)

  // request promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    function receive (error, response, data) {
      if (error) {
        reject(new Error(error))
      } else {
        const {statusCode, statusMessage} = response
        const success = (statusCode >= 200 && statusCode < 300)
        if (statusCode === 204) { // means statusMessage === 'No Content'
          resolve({success, statusCode, statusMessage})
        } else if (success) {
          resolve(JSON.parse(data))
        } else {
          const err = jiraConfig.nonVoids(JSON.parse(data))
          reject(new Error(JSON.stringify(err)))
        }
      }
      console.log('END OF REST CALL')
    }
    request({url, headers, method, body, agent: jiraConfig.agent}, receive) // json: true
  })
}

module.exports = { requestJira }
