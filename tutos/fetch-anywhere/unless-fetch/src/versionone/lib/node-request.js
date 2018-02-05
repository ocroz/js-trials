'use strict'

const request = require('request')

async function _requestVone (voneConfig = {}, method = 'GET', req = 'rest-1.v1/Data/Scope/0', input) {
  // voneConfig = {voneUrl, getAuthHeader, fixUrl, logError, agent, nonVoids}
  for (let attr of ['voneUrl', 'getAuthHeader', 'fixUrl', 'logError', 'nonVoids']) {
    if (!voneConfig[attr]) { throw new Error(`requestVone: ${attr} is undefined`) }
  }
  const { voneUrl, getAuthHeader, fixUrl, logError, agent, nonVoids } = voneConfig

  // request parameters
  const url = voneUrl + '/' + fixUrl(req)
  const body = input && JSON.stringify(input)
  const authHeader = await getAuthHeader()
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
          const whoami = resp.headers['v1-memberid']
          if (success) {
            resolve({whoami, data})
          } else {
            const err = nonVoids(data)
            logError(method, url, statusCode, statusMessage)
            reject(new Error(JSON.stringify(err)))
          }
        } catch (err) { // VersionOne sends an html page on unauthorized requests
          logError(method, url, statusCode, statusMessage)
          reject(new Error(JSON.stringify(response)))
        }
      }
      console.log('END OF REST CALL')
    }
    request({url, headers, method, body, agent}, receive) // json: true
  })
}

function requestVone (voneConfig, method, request, input) {
  return (method && request)
    ? _requestVone(voneConfig, method, request, input).then(res => res.data)
    : _requestVone(voneConfig, method, request, input).then(res => res.whoami)
}

module.exports = { requestVone }
