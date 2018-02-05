'use strict'

async function fetchJira (jiraConfig = {}, method = 'GET', request = 'api/2/myself', input) {
  // jiraConfig = {jiraUrl, getFetch, getAuthHeader, logError, agent, nonVoids} // header and agent are undefined in browser
  for (let attr of ['jiraUrl', 'getFetch', 'getAuthHeader', 'logError', 'nonVoids']) {
    if (!jiraConfig[attr]) { throw new Error(`fetchJira: ${attr} is undefined`) }
  }
  const { jiraUrl, getFetch, getAuthHeader, logError, agent, nonVoids } = jiraConfig

  // fetch parameters
  const fetch = getFetch()
  const url = jiraUrl + '/rest/' + request
  const body = input && JSON.stringify(input)
  const authHeader = getAuthHeader(url, method)
  const headers = authHeader // undefined in browser by default
    ? { 'Accept': 'application/json', 'Content-Type': 'application/json', [authHeader.name]: authHeader.data }
    : { 'Accept': 'application/json', 'Content-Type': 'application/json' } // +by default { Cookie: <cookie> }
  const [mode, credentials] = ['cors', 'include'] // to support both browser and node
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
      if (status === 204) { // means statusText === 'No Content'
        resolve(response)
      } else if (ok) {
        resp.json().then(data => { resolve(data) })
      } else {
        resp.json().catch(() => response).then(data => {
          const err = nonVoids(data)
          logError(method, url, status, statusText)
          reject(new Error(JSON.stringify(err)))
        })
      }
    })
    .catch(err => { reject(err) })
    .then(() => {
      console.log('END OF REST CALL')
    })
  })
}

module.exports = { fetchJira }
