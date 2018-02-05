'use strict'

const httpntlm = require('httpntlm')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

async function _httpntlmVone (voneConfig = {}, method = 'GET', request = 'rest-1.v1/Data/Scope/0', input) {
  // voneConfig = {voneUrl, getAuthOpts, logError, nonVoids}
  for (let attr of ['voneUrl', 'getAuthOpts', 'logError', 'nonVoids']) {
    if (!voneConfig[attr]) { throw new Error(`httpntlmVone: ${attr} is undefined`) }
  }
  const { voneUrl, getAuthOpts, logError, nonVoids } = voneConfig

  // httpntlm parameters
  const url = voneUrl + '/' + request
  const body = input && JSON.stringify(input)
  const { username, password, domain, workstation } = getAuthOpts()
  const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }

  // httpntlm promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    function receive (err, resp) {
      if (err) {
        logError(method, url, 'internal httpntlm error')
        reject(err)
      } else {
        const {statusCode, statusMessage} = resp
        const success = (statusCode >= 200 && statusCode < 300)
        const response = {success, statusCode, statusMessage}
        const whoami = resp.headers['v1-memberid']
        try {
          const data = (statusCode === 204) ? response : JSON.parse(resp.body) // 204 means statusMessage === 'No Content'
          if (success) {
            resolve({whoami, data})
          } else {
            const err = nonVoids(data)
            logError(method, url, statusCode, statusMessage)
            reject(new Error(JSON.stringify(err)))
          }
        } catch (err) { // VersionOne sends an html page on unauthorized requests so JSON.parse() fails
          logError(method, url, statusCode, statusMessage)
          reject(new Error(JSON.stringify(response)))
        }
      }
      console.log('END OF REST CALL')
    }

    httpntlm[method.toLowerCase()]({url, method, headers, username, password, domain, workstation, body}, receive)
  })
}

function httpntlmVone (voneConfig, method, request, input) {
  return (method && request)
    ? _httpntlmVone(voneConfig, method, request, input).then(res => res.data)
    : _httpntlmVone(voneConfig, method, request, input).then(res => res.whoami)
}

module.exports = { httpntlmVone }
