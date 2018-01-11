'use strict'

/* globals webix */

async function webixJira (jiraConfig = {}, method = 'GET', request = 'api/2/myself', input) {
  // jiraConfig = {jiraUrl, getFetch, getAuthHeader, agent, nonVoids} // header and agent are undefined in browser
  for (let attr of ['jiraUrl', 'nonVoids']) {
    if (!jiraConfig[attr]) { throw new Error(`webixJira: ${attr} is undefined`) }
  }

  // webix parameters
  const url = jiraConfig.jiraUrl + '/rest/' + request
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
      text && reject(new Error(JSON.stringify(jiraConfig.nonVoids(data.json()))))
      reject(new Error('Internal webix error'))
    }
    function complete () {
      console.log('END OF REST CALL')
    }
    webix.attachEvent('onBeforeAjax', onBeforeAjax)
    switch (method) {
      case 'POST':
        webix.ajax().post(url, body, {error, success}).then(complete)
        break
      case 'PUT':
        webix.ajax().put(url, body, {error, success}).then(complete)
        break
      case 'DELETE':
        webix.ajax().del(url, body, {error, success}).then(complete)
        break
      case 'GET':
      default:
        webix.ajax(url, body, {error, success}).then(complete)
        break
    }
  })
}

module.exports = { webixJira }
