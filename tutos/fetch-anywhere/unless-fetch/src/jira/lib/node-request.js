'use strict'

const request = require('request')

async function requestJira (jiraConfig = {}, method = 'GET', req = 'api/2/myself', input) {
  // jiraConfig = {jiraUrl, getAuthHeader, logError, agent, nonVoids}
  for (let attr of ['jiraUrl', 'getAuthHeader', 'logError', 'nonVoids']) {
    if (!jiraConfig[attr]) { throw new Error(`requestJira: ${attr} is undefined`) }
  }
  const { jiraUrl, getAuthHeader, logError, agent, nonVoids } = jiraConfig

  // request parameters
  const url = jiraUrl + '/rest/' + req
  const body = input && JSON.stringify(input)
  const authHeader = getAuthHeader(url, method)
  const headers = authHeader
    ? { 'Accept': 'application/json', 'Content-Type': 'application/json', [authHeader.name]: authHeader.data }
    : { 'Accept': 'application/json', 'Content-Type': 'application/json' }

  // request promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    function receive (error, resp, body) {
      if (error) {
        logError(method, url, 'internal request error')
        reject(new Error(error))
      } else {
        const {statusCode, statusMessage} = resp
        const success = (statusCode >= 200 && statusCode < 300)
        const response = {success, statusCode, statusMessage}
        try {
          const data = (statusCode === 204) ? response : JSON.parse(body) // 204 means statusMessage === 'No Content'
          if (success) {
            resolve(data)
          } else {
            const err = nonVoids(data)
            logError(method, url, statusCode, statusMessage)
            reject(new Error(JSON.stringify(err)))
          }
        } catch (err) {
          logError(method, url, statusCode, statusMessage)
          reject(new Error(JSON.stringify(response)))
        }
      }
      console.log('END OF REST CALL')
    }
    request({url, headers, method, body, agent}, receive) // json: true
  })
}

module.exports = { requestJira }
