'use strict'

/* globals webix */

async function webixJira (jiraConfig = {}, method = 'GET', request = 'api/2/myself', input) {
  // jiraConfig = {jiraUrl, nonVoids} // header and agent are undefined in browser
  for (let attr of ['jiraUrl', 'nonVoids']) {
    if (!jiraConfig[attr]) { throw new Error(`webixJira: ${attr} is undefined`) }
  }
  const { jiraUrl, nonVoids } = jiraConfig

  // webix parameters
  const url = jiraUrl + '/rest/' + request
  const body = input && JSON.stringify(input)

  // webix promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    function onBeforeAjax (mode, url, data, request, headers, files, promise) {
      request.withCredentials = true // request = xhr
      headers['Accept'] = 'application/json'
      headers['Content-type'] = 'application/json'
    }
    function success (text, data, ajax) {
      text && resolve(data.json())
      const { status, statusText } = ajax
      resolve({ success: true, status, statusText })
    }
    function error (text, data, ajax) {
      text && reject(new Error(JSON.stringify(nonVoids(data.json()))))
      reject(new Error('Internal webix error'))
    }
    function complete () {
      console.log('END OF REST CALL')
    }
    webix.attachEvent('onBeforeAjax', onBeforeAjax)
    webix.ajax()[method.toLowerCase()](url, body, {error, success}).then(complete)
  })
}

module.exports = { webixJira }
