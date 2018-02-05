'use strict'

async function _fetchVone (voneConfig = {}, method = 'GET', request = 'rest-1.v1/Data/Scope/0', input) {
  // voneConfig = {voneUrl, getFetch, getAuthHeader, fixUrl, logError, agent, nonVoids} // header and agent are undefined in browser
  for (let attr of ['voneUrl', 'getFetch', 'getAuthHeader', 'fixUrl', 'logError', 'nonVoids']) {
    if (!voneConfig[attr]) { throw new Error(`fetchVone: ${attr} is undefined`) }
  }
  const { voneUrl, getFetch, getAuthHeader, fixUrl, logError, agent, nonVoids } = voneConfig

  // fetch parameters
  const fetch = getFetch()
  const url = voneUrl + '/' + fixUrl(request)
  const body = input && JSON.stringify(input)
  const authHeader = await getAuthHeader()
  const headers = authHeader
    ? { 'Accept': 'application/json', 'Content-Type': 'application/json', [authHeader.name]: authHeader.data }
    : { 'Accept': 'application/json', 'Content-Type': 'application/json' }
  const [mode, credentials] = ['cors', 'include']
  // console.log(url, method, body, headers, mode, credentials, agent)

  // fetch promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    fetch(url, {method, body, headers, mode, credentials, agent})
    .catch(err => {
      logError(method, url, 'internal fetch error')
      reject(err)
    })
    .then(resp => {
      const { ok, status, statusText } = resp
      const response = { ok, status, statusText }
      const whoami = resp.headers.get('V1-MemberID')
      if (status === 204) { // means statusText === 'No Content'
        resolve({whoami, data: response})
      } else if (ok) {
        resp.json().then(data => resolve({whoami, data}))
      } else {
        resp.json().catch(() => response).then(data => { // VersionOne sends an html page on unauthorized requests
          const err = nonVoids(data)
          logError(method, url, status, statusText)
          reject(new Error(JSON.stringify(err)))
        })
      }
    })
    .catch(err => reject(err))
    .then(() => {
      console.log('END OF REST CALL')
    })
  })
}

function fetchVone (voneConfig, method, request, input) {
  return (method && request)
    ? _fetchVone(voneConfig, method, request, input).then(res => res.data)
    : _fetchVone(voneConfig, method, request, input).then(res => res.whoami)
}

module.exports = { fetchVone }
