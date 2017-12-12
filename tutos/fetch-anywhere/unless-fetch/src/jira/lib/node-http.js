'use strict'

const http = require('http')
const url = require('url')
const { nonVoids } = require('../../common/lib/utils')

async function httpJira (auth = {}, method = 'GET', request = 'api/2/myself', input) {
  // auth = {jira, credentials, agent}
  if (auth.jira === undefined) { throw new Error('jira url is undefined') }

  // http parameters
  const {protocol, hostname, port, path} = url.parse(auth.jira + '/rest/' + request)
  const body = input && JSON.stringify(input)
  const headers = auth.credentials
    ? { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': auth.credentials }
    : { 'Accept': 'application/json', 'Content-Type': 'application/json' }

  // http promise
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
          const err = nonVoids(JSON.parse(data))
          reject(new Error(JSON.stringify(err)))
        }
        console.log('END OF REST CALL')
      })
    }

    const req = http.request({protocol, hostname, port, path, method, headers, agent: auth.agent}, receive)

    req.on('error', (err) => {
      reject(new Error(`Internal http error: ${err.message}`))
      console.log('END OF REST CALL')
    })

    // write data to request body
    req.end(body)
  })
}

module.exports = { httpJira }
