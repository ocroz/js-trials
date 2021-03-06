'use strict'

const https = require('https')
const _url = require('url')

async function httpsJira (jiraConfig = {}, method = 'GET', request = 'api/2/myself', input) {
  // jiraConfig = {jiraUrl, getAuthHeader, logError, agent, nonVoids}
  for (let attr of ['jiraUrl', 'getAuthHeader', 'logError', 'nonVoids']) {
    if (!jiraConfig[attr]) { throw new Error(`httpsJira: ${attr} is undefined`) }
  }
  const { jiraUrl, getAuthHeader, logError, agent, nonVoids } = jiraConfig

  // https parameters
  const url = jiraUrl + '/rest/' + request
  const {protocol, hostname, port, path} = _url.parse(url)
  const body = input && JSON.stringify(input)
  const authHeader = getAuthHeader(url, method)
  const headers = authHeader
    ? { 'Accept': 'application/json', 'Content-Type': 'application/json', [authHeader.name]: authHeader.data }
    : { 'Accept': 'application/json', 'Content-Type': 'application/json' }

  // https promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    function receive (res) {
      let data = ''
      const {statusCode, statusMessage} = res
      const success = (statusCode >= 200 && statusCode < 300)
      const response = {success, statusCode, statusMessage}
      res.setEncoding('utf8')
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        try {
          const json = (statusCode === 204) ? response : JSON.parse(data) // 204 means statusMessage === 'No Content'
          if (success) {
            resolve(json)
          } else {
            const err = nonVoids(json)
            logError(method, url, statusCode, statusMessage)
            reject(new Error(JSON.stringify(err)))
          }
        } catch (err) {
          logError(method, url, statusCode, statusMessage)
          reject(new Error(JSON.stringify(response)))
        }
        console.log('END OF REST CALL')
      })
    }

    try {
      const req = https.request({protocol, hostname, port, path, method, headers, agent}, receive)

      req.on('error', (err) => {
        logError(method, url, 'internal https error')
        reject(new Error(`Internal https error: ${err.message}`))
        console.log('END OF REST CALL')
      })

      // write data to request body
      req.end(body)
    } catch (err) {
      logError(method, url, 'internal https error')
      reject(new Error(`Internal https error: ${err.message}`))
      console.log('END OF REST CALL')
    }
  })
}

module.exports = { httpsJira }
