'use strict'

const { nonVoids } = require('../../common/lib/utils')

async function fetchJira (auth = {}, method = 'GET', request = 'api/2/myself', input) {
  // auth = {getFetch, jira, credentials, agent} // credentials and agent are undefined in browser
  if (auth.getFetch === undefined) { throw new Error('fetchJira: getFetch() is undefined') }
  if (auth.jira === undefined) { throw new Error('jira url is undefined') }

  // fetch parameters
  const fetch = auth.getFetch()
  const url = auth.jira + '/rest/' + request
  const body = input && JSON.stringify(input)
  const headers = auth.credentials // to support both browser and node
    ? { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': auth.credentials }
    : { 'Accept': 'application/json', 'Content-Type': 'application/json' }
  const [mode, credentials, agent] = ['cors', 'include', auth.agent] // to support both browser and node
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
          const err = nonVoids(data)
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
