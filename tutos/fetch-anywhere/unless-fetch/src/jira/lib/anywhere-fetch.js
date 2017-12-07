'use strict'

const { nonVoids } = require('../../common/lib/utils')

async function fetchJira (auth = {}, method = 'GET', request = 'api/2/myself', input) {
  // auth = {getFetch, jira, credentials, agent}
  if (auth.getFetch === undefined) { throw new Error('jiraFetch: getFetch() is undefined') }
  if (auth.jira === undefined) { auth.jira = 'https://atlassian-test.hq.k.grp/jira' }

  // fetch parameters
  const fetch = auth.getFetch()
  const url = auth.jira + '/rest/' + request
  const body = input && JSON.stringify(input)
  const headers = auth.credentials
    ? { 'Content-Type': 'application/json', 'Authorization': auth.credentials }
    : { 'Content-Type': 'application/json' }
  const [mode, credentials, agent] = ['cors', 'include', auth.agent]
  // console.log(url, method, body, headers, mode, credentials, agent)

  // fetch promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    fetch(url, {method, body, headers, mode, credentials, agent})
    .then((resp) => {
      const { ok, status, statusText } = resp
      const response = { ok, status, statusText }
      if (!resp.ok) {
        // The error could be embedded in a json response
        resp.json()
        .catch(() => reject(new Error(JSON.stringify(response)))) // The error is not embedded in a json response
        .then(json => { // Keep only the non-empty attributes from the json response
          const err = nonVoids(json)
          reject(new Error(JSON.stringify(err)))
        })
      } else {
        if (resp.status === 204) { // means statusText === 'No Content'
          resolve(response)
        } else {
          resp.json().then(json => { resolve(json) })
        }
      }
    })
    .catch(err => { reject(err) })
    .then(() => {
      console.log('END OF REST CALL')
    })
  })
}

module.exports = { fetchJira }
