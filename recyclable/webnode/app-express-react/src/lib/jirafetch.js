'use strict'

async function jiraFetch (auth = {}, method = 'GET', request = 'api/2/myself', input) {
  if (auth.jira === undefined) { auth.jira = 'https://atlassian-test.hq.k.grp/jira' }
  if (auth.getFetch === undefined) { throw new Error('jiraFetch: getFetch() is undefined') }
  const fetch = auth.getFetch()
  console.log('BEGINNING OF REST CALL')
  const url = auth.jira + '/rest/' + request
  const headers = auth.credentials !== undefined
    ? { 'Content-Type': 'application/json', 'Authorization': auth.credentials }
    : { 'Content-Type': 'application/json' }
  const agent = auth.agent
  const body = input !== undefined ? JSON.stringify(input) : undefined
  return new Promise((resolve, reject) => {
    fetch(url, {
      method,
      body,
      headers,
      mode: 'cors',
      credentials: 'include',
      agent
    })
    .then((resp) => {
      const { ok, status, statusText } = resp
      const response = { ok, status, statusText }
      if (!resp.ok) {
        reject(new Error(JSON.stringify(response)))
      } else {
        if (resp.status === 204) { // means statusText === 'No Content'
          resolve(response)
        } else {
          resp.json().then((json) => { resolve(json) })
        }
      }
    })
    .catch((err) => { reject(err) })
    .then(() => {
      console.log('END OF REST CALL')
    })
  })
}

module.exports = { jiraFetch }
