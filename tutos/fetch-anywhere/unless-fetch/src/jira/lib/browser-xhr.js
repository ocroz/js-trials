'use strict'

/* globals XMLHttpRequest */

const { nonVoids } = require('../../common/lib/utils')

async function xhrJira (auth = {}, method = 'GET', request = 'api/2/myself', input) {
  // auth = {jira, credentials, agent}
  if (auth.jira === undefined) { throw new Error('jira url is undefined') }

  // xhr parameters
  const url = auth.jira + '/rest/' + request
  const body = input && JSON.stringify(input)
  const xasync = true

  // xhr promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url, xasync)
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.withCredentials = true
    xhr.onload = function () {
      const { status, statusText } = xhr
      const success = (status >= 200 && status < 300)
      const data = xhr.response && JSON.parse(xhr.response)
      if (xhr.status === 204) { // means statusText === 'No Content'
        resolve({ success, status, statusText })
      } else if (success) {
        resolve(data)
      } else {
        reject(new Error(JSON.stringify(nonVoids(data))))
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
