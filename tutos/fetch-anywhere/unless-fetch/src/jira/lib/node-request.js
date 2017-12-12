'use strict'

const request = require('request')
const { nonVoids } = require('../../common/lib/utils')

async function requestJira (auth = {}, method = 'GET', req = 'api/2/myself', input) {
  // auth = {jira, credentials, agent}
  if (auth.jira === undefined) { throw new Error('jira url is undefined') }

  // request parameters
  const url = auth.jira + '/rest/' + req
  const body = input && JSON.stringify(input)
  const headers = auth.credentials
    ? { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': auth.credentials }
    : { 'Accept': 'application/json', 'Content-Type': 'application/json' }

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
          const err = nonVoids(JSON.parse(data))
          reject(new Error(JSON.stringify(err)))
        }
      }
      console.log('END OF REST CALL')
    }
    request({url, headers, method, body, agent: auth.agent}, receive) // json: true
  })
}

module.exports = { requestJira }
