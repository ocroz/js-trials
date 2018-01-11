'use strict'

const https = require('https')
const _url = require('url')

async function httpsJira (jiraConfig = {}, method = 'GET', request = 'api/2/myself', input) {
  // jiraConfig = {jiraUrl, getAuthHeader, agent, nonVoids}
  for (let attr of ['jiraUrl', 'getAuthHeader', 'nonVoids']) {
    if (!jiraConfig[attr]) { throw new Error(`httpsJira: ${attr} is undefined`) }
  }

  // https parameters
  const url = jiraConfig.jiraUrl + '/rest/' + request
  const {protocol, hostname, port, path} = _url.parse(url)
  const body = input && JSON.stringify(input)
  const authHeader = jiraConfig.getAuthHeader(url, method)
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
      res.setEncoding('utf8')
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        if (statusCode === 204) { // means statusMessage === 'No Content'
          resolve({success, statusCode, statusMessage})
        } else if (success) {
          resolve(JSON.parse(data))
        } else {
          const err = jiraConfig.nonVoids(JSON.parse(data))
          reject(new Error(JSON.stringify(err)))
        }
        console.log('END OF REST CALL')
      })
    }

    const req = https.request({protocol, hostname, port, path, method, headers, agent: jiraConfig.agent}, receive)

    req.on('error', (err) => {
      reject(new Error(`Internal http error: ${err.message}`))
      console.log('END OF REST CALL')
    })

    // write data to request body
    req.end(body)
  })
}

module.exports = { httpsJira }
