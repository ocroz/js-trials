'use strict'

/* globals XMLHttpRequest */

async function xhrJira (jiraConfig = {}, method = 'GET', request = 'api/2/myself', input) {
  // jiraConfig = {jiraUrl, getFetch, getAuthHeader, agent, nonVoids} // header and agent are undefined in browser
  for (let attr of ['jiraUrl', 'nonVoids']) {
    if (!jiraConfig[attr]) { throw new Error(`xhrJira: ${attr} is undefined`) }
  }

  // xhr parameters
  const url = jiraConfig.jiraUrl + '/rest/' + request
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
        reject(new Error(JSON.stringify(jiraConfig.nonVoids(data))))
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
