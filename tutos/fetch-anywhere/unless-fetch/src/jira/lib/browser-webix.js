'use strict'

/* globals webix */

const { nonVoids } = require('../../common/lib/utils')

async function webixJira (auth = {}, method = 'GET', request = 'api/2/myself', input) {
  // auth = {jira, credentials, agent}
  if (auth.jira === undefined) { auth.jira = 'https://atlassian-test.hq.k.grp/jira' }

  // webix parameters
  const url = auth.jira + '/rest/' + request
  const body = input && JSON.stringify(input)

  // webix promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    function onBeforeAjax (mode, url, data, request, headers, files, promise) {
      request.withCredentials = true // request = xhr
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
