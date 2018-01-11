'use strict'

async function fetchJira (jiraConfig = {}, method = 'GET', request = 'api/2/myself', input) {
  // jiraConfig = {jiraUrl, getFetch, getAuthHeader, agent, nonVoids} // header and agent are undefined in browser
  for (let attr of ['jiraUrl', 'getFetch', 'getAuthHeader', 'nonVoids']) {
    if (!jiraConfig[attr]) { throw new Error(`fetchJira: ${attr} is undefined`) }
  }

  // fetch parameters
  const fetch = jiraConfig.getFetch()
  const url = jiraConfig.jiraUrl + '/rest/' + request
  const body = input && JSON.stringify(input)
  const authHeader = jiraConfig.getAuthHeader(url, method)
  const headers = authHeader // undefined in browser by default
    ? { 'Accept': 'application/json', 'Content-Type': 'application/json', [authHeader.name]: authHeader.data }
    : { 'Accept': 'application/json', 'Content-Type': 'application/json' } // +by default { Cookie: <cookie> }
  const [mode, credentials, agent] = ['cors', 'include', jiraConfig.agent] // to support both browser and node
  // console.log(url, method, body, headers, mode, credentials, agent)

  // fetch promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    fetch(url, {method, body, headers, mode, credentials, agent})
    .then(resp => {
      const { ok, status, statusText } = resp
      if (status === 204) { // means statusText === 'No Content'
        resolve({ ok, status, statusText })
      } else if (ok) {
        resp.json().then(data => { resolve(data) })
      } else {
        resp.json().then(data => {
          const err = jiraConfig.nonVoids(data)
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
