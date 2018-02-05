'use strict'

const httpreq = require('httpreq') // supplied with httpntlm
const { ntlmHandshake } = require('../ntlm/handshake-httpreq')

async function _httpreqVone (voneConfig = {}, method = 'GET', request = 'rest-1.v1/Data/Scope/0', input) {
  // voneConfig = {voneUrl, getAuthHeader, fixUrl, logError, agent, nonVoids}
  for (let attr of ['voneUrl', 'getAuthHeader', 'fixUrl', 'logError', 'nonVoids']) {
    if (!voneConfig[attr]) { throw new Error(`httpreqVone: ${attr} is undefined`) }
  }
  const { voneUrl, getAuthHeader, fixUrl, logError, agent, nonVoids } = voneConfig

  // httpreq parameters
  const url = voneUrl + '/' + fixUrl(request)
  const body = input && JSON.stringify(input)
  const authHeader = await getAuthHeader(ntlmHandshake)
  const headers = authHeader
    ? { 'Accept': 'application/json', 'Content-Type': 'application/json', [authHeader.name]: authHeader.data }
    : { 'Accept': 'application/json', 'Content-Type': 'application/json' }

  // httpreq promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    function receive (err, resp) {
      if (err) {
        logError(method, url, 'internal httpreq error')
        reject(err)
      } else {
        const {statusCode, statusMessage} = resp
        const success = (statusCode >= 200 && statusCode < 300)
        const response = {success, statusCode, statusMessage}
        const whoami = resp.headers['v1-memberid']
        try {
          const data = (statusCode === 204) ? response : JSON.parse(resp.body) // means statusMessage === 'No Content'
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

    httpreq[method.toLowerCase()](url, {method, headers, body, agent}, receive)
  })
}

function httpreqVone (voneConfig, method, request, input) {
  return (method && request)
    ? _httpreqVone(voneConfig, method, request, input).then(res => res.data)
    : _httpreqVone(voneConfig, method, request, input).then(res => res.whoami)
}

module.exports = { httpreqVone }
