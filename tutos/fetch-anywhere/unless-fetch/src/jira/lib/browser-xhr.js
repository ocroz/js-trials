'use strict'

/* globals XMLHttpRequest */

const { nonVoids } = require('../../common/lib/utils')

async function xhrJira (auth = {}, method = 'GET', request = 'api/2/myself', input) {
  // auth = {jira, credentials, agent}
  if (auth.jira === undefined) { auth.jira = 'https://atlassian-test.hq.k.grp/jira' }

  // xhr parameters
  const url = auth.jira + '/rest/' + request
  const body = input && JSON.stringify(input)
  const xasync = true

  // xhr promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url, xasync)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.withCredentials = true
    xhr.onload = function () {
      const data = xhr.response && JSON.parse(xhr.response)
      if (xhr.statusText !== 'OK' && xhr.statusText !== 'Created' && xhr.statusText !== 'No Content') {
        reject(new Error(JSON.stringify(nonVoids(data))))
      } else if (xhr.status === 204) { // means statusText === 'No Content'
        const { status, statusText } = xhr
        resolve({ success: true, status, statusText })
      } else {
        resolve(data)
      }
    }
    xhr.onerror = function () {
      reject(new Error('Internal XMLHttpRequest error'))
    }
    xhr.onloadend = function () {
      console.log('END OF REST CALL')
    }
    xhr.send(body)
  })
}

module.exports = { xhrJira }
