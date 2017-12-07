(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function trycatch (cb) {
  console.log('launching async processes')
  _trycatch(cb)
  console.log('async processes launched')
}

async function _trycatch (cb) {
  try {
    await cb()
    console.log('async processes succeeded, nothing more to do, leaving script')
  } catch (err) {
    console.error('async processes failed with error:', err.message)
  }
}

module.exports = { trycatch }

},{}],2:[function(require,module,exports){
'use strict'

function nonVoids (input) {
  let output = {}
  for (let attr in input) {
    if (Object.keys(input[attr]).length > 0) { // input[attr] is either array or object
      output[attr] = input[attr]
    }
  }
  return output
}

module.exports = { nonVoids }

},{}],3:[function(require,module,exports){
'use strict'

const { getEnvAuth, contactJira, trycatch } = require('./env/index')

// https://atlassian-test.hq.k.grp/jira/plugins/servlet/restbrowser
// GET priorities (OK as anonymous, as long as no credentials is passed)
// GET myself (must be logged in)
// POST new issue
// POST new comment
// GET new comment
// PUT update to comment
// GET updated comment
// DELETE comment

async function main () {
  'use strict'
  const auth = getEnvAuth()

  const priorities = await contactJira(auth, 'GET', 'api/2/priority').then((json) => { return json.map(o => o.name) })
  console.log('JIRA priorities are:', priorities)

  const { name: myself } = await contactJira(auth)
  console.log('I am', myself)

  const { key: issuekey } = await contactJira(auth, 'POST', 'api/2/issue', {
    'fields': {
      'project': {'key': 'SPLPRJ'},
      'assignee': {'name': myself},
      'issuetype': {'name': 'Task'},
      'priority': {'name': priorities[1]},
      'summary': 'Submit issue through fetch',
      'description':
        '{panel:title=What would be the added value?|borderColor=#ccc| titleBGColor=#c2ffa2|bgColor=#fff}' +
        'fetch is available both at client and server sides' +
        '{panel}' +
        '{panel:title=Any details about the desired modification?|borderColor=#ccc| titleBGColor=#faacad|bgColor=#fff}' +
        'npm i node-fetch' +
        '{panel}'
    }
  })
  console.log('submitted issue:', issuekey, auth.jira + '/browse/' + issuekey)

  const { id: commentid } = await contactJira(auth, 'POST', 'api/2/issue/' + issuekey + '/comment', {
    'body': 'nice comment submitted through fetch'
  })
  console.log('submitted comment:', commentid)

  const { id: cid, body: cbody } = await contactJira(auth, 'GET', 'api/2/issue/' + issuekey + '/comment/' + commentid)
  console.log('comment is:', cid, cbody)

  const { id: pid, body: pbody } = await contactJira(auth, 'PUT', 'api/2/issue/' + issuekey + '/comment/' + commentid, {
    'body': 'nice comment updated through fetch'
  })
  console.log('comment is:', pid, pbody)

  const { id: uid, body: ubody } = await contactJira(auth, 'GET', 'api/2/issue/' + issuekey + '/comment/' + commentid)
  console.log('comment is:', uid, ubody)

  const res = await contactJira(auth, 'DELETE', 'api/2/issue/' + issuekey + '/comment/' + commentid)
  console.log('comment deleted with status:', res)
}

trycatch(main)

},{"./env/index":4}],4:[function(require,module,exports){
'use strict'

/* global fetch */

const { trycatch } = require('../../common/lib/trycatch')
const { fetchJira } = require('../lib/anywhere-fetch')
const { jqueryJira } = require('../lib/browser-jquery')
const { xhrJira } = require('../lib/browser-xhr')

const altFetchCase = 0 // 0=fetch, 1=jquery, 2=xhr, 3=webix

function getEnvAuth () {
  console.log('Running under browser')
  const [jira, credentials, agent] = [
    'https://atlassian-test.hq.k.grp/jira', undefined, undefined
  ]
  return {getFetch, jira, credentials, agent}
}

function getFetch () {
  return fetch
}

function contactJira (...args) {
  switch (altFetchCase) {
    case 1:
      console.log('Contacting JIRA via jqueryJira()...')
      return jqueryJira(...args)
    case 2:
      console.log('Contacting JIRA via xhrJira()...')
      return xhrJira(...args)
    case 0:
    default:
      console.log('Contacting JIRA via fetchJira()...')
      return fetchJira(...args)
  }
}

module.exports = { getEnvAuth, contactJira, trycatch }

},{"../../common/lib/trycatch":1,"../lib/anywhere-fetch":5,"../lib/browser-jquery":6,"../lib/browser-xhr":7}],5:[function(require,module,exports){
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

},{"../../common/lib/utils":2}],6:[function(require,module,exports){
'use strict'

/* globals $ */

async function jqueryJira (auth = {}, method = 'GET', request = 'api/2/myself', input) {
  // auth = {jira, credentials, agent}
  if (auth.jira === undefined) { auth.jira = 'https://atlassian-test.hq.k.grp/jira' }

  // jquery parameters
  const url = auth.jira + '/rest/' + request
  const type = method
  const data = input && JSON.stringify(input)
  const [dataType, crossDomain, contentType, async, xhrFields] =
    ['json', true, 'application/json', true, {withCredentials: true}]

  // jquery promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    function success (data, textStatus, result) {
      if (result.status === 204) { // means statusText === 'No Content'
        const { status, statusText } = result
        resolve({ textStatus, status, statusText })
      } else {
        resolve(data)
      }
    }
    function error (result, textStatus, error) {
      if (result.status === 0) {
        reject(new Error('Internal jquery error'))
      } else {
        const data = nonVoids(JSON.parse(result.responseText))
        reject(new Error(JSON.stringify(data)))
      }
    }
    function complete (result, textStatus) {
      console.log('END OF REST CALL')
    }
    $.ajax({type, url, dataType, crossDomain, contentType, async, data, xhrFields, success, error, complete})
  })
}

// Paste this utils function here as well to workaround a browserify problem
function nonVoids (input) {
  let output = {}
  for (let attr in input) {
    if (Object.keys(input[attr]).length > 0) { // input[attr] is either array or object
      output[attr] = input[attr]
    }
  }
  return output
}
// Paste this utils function here as well to workaround a browserify problem

module.exports = { jqueryJira }

},{}],7:[function(require,module,exports){
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
      } else if (xhr.status === 204) {
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

},{"../../common/lib/utils":2}]},{},[3]);
