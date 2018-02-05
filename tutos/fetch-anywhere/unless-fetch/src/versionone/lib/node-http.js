'use strict'

const http = require('http')
const _url = require('url')

async function _httpVone (voneConfig = {}, method = 'GET', request = 'rest-1.v1/Data/Scope/0', input) {
  // voneConfig = {voneUrl, getAuthHeader, fixUrl, logError, agent, nonVoids}
  for (let attr of ['voneUrl', 'getAuthHeader', 'fixUrl', 'logError', 'nonVoids']) {
    if (!voneConfig[attr]) { throw new Error(`httpVone: ${attr} is undefined`) }
  }
  const { voneUrl, getAuthHeader, fixUrl, logError, agent, nonVoids } = voneConfig

  // http parameters
  const url = voneUrl + '/' + fixUrl(request)
  const { protocol, hostname, port, path } = _url.parse(url)
  const body = input && JSON.stringify(input)
  const authHeader = await getAuthHeader()
  const headers = authHeader
    ? { 'Accept': 'application/json', 'Content-Type': 'application/json', [authHeader.name]: authHeader.data }
    : { 'Accept': 'application/json', 'Content-Type': 'application/json' }

  // http promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    function receive (res) {
      let data = ''
      const {statusCode, statusMessage} = res
      const success = (statusCode >= 200 && statusCode < 300)
      const response = {success, statusCode, statusMessage}
      const whoami = res.headers['v1-memberid']
      res.setEncoding('utf8')
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        try {
          const json = (statusCode === 204) ? response : JSON.parse(data) // 204 means statusMessage === 'No Content'
          if (success) {
            resolve({whoami, data: json})
          } else {
            const err = nonVoids(json)
            logError(method, url, statusCode, statusMessage)
            reject(new Error(JSON.stringify(err)))
          }
        } catch (err) { // VersionOne sends an html page on unauthorized requests
          logError(method, url, statusCode, statusMessage)
          reject(new Error(JSON.stringify(response)))
        }
        console.log('END OF REST CALL')
      })
    }

    try {
      const req = http.request({protocol, hostname, port, path, method, headers, agent}, receive)

      req.on('error', (err) => {
        logError(method, url, 'internal http error')
        reject(new Error(`Internal http error: ${err.message}`))
        console.log('END OF REST CALL')
      })

      // write data to request body
      req.end(body)
    } catch (err) {
      logError(method, url, 'internal http error')
      reject(new Error(`Internal http error: ${err.message}`))
      console.log('END OF REST CALL')
    }
  })
}

function httpVone (voneConfig, method, request, input) {
  return (method && request)
    ? _httpVone(voneConfig, method, request, input).then(res => res.data)
    : _httpVone(voneConfig, method, request, input).then(res => res.whoami)
}

module.exports = { httpVone }
