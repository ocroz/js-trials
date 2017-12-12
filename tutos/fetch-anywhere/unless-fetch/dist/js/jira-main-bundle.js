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
module.exports={
  "story": 0,
  "altFetchCase": 0,
  "jiraUrl": "https://atlassian-test.hq.k.grp/jira"
}

},{}],4:[function(require,module,exports){
'use strict'

/* global fetch */

const { trycatch } = require('../../common/lib/trycatch')
const { fetchJira } = require('../lib/anywhere-fetch')
const { jqueryJira } = require('../lib/browser-jquery')
const { webixJira } = require('../lib/browser-webix')
const { xhrJira } = require('../lib/browser-xhr')

const jiraConfig = require('../cfg/jira-config.json')

console.log('Running under browser')

// const story = 0 // 0=calls.js, 1=errors.js
// const altFetchCase = 0 // 0=fetch, 1=jquery, 2=xhr, 3=webix
const [ story, altFetchCase, jiraUrl ] = [ // browserify uses envify for process.env
  Number(undefined) || jiraConfig.story,
  Number("0") || jiraConfig.altFetchCase,
  undefined || jiraConfig.jiraUrl
]
console.log({story, altFetchCase, jiraUrl})

function getEnvAuth () {
  return {getFetch, jira: jiraUrl}
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
    case 3:
      console.log('Contacting JIRA via webixJira()...')
      return webixJira(...args)
    case 0:
    default:
      console.log('Contacting JIRA via fetchJira()...')
      return fetchJira(...args)
  }
}

module.exports = { story, getEnvAuth, contactJira, trycatch }

},{"../../common/lib/trycatch":1,"../cfg/jira-config.json":3,"../lib/anywhere-fetch":5,"../lib/browser-jquery":6,"../lib/browser-webix":7,"../lib/browser-xhr":8}],5:[function(require,module,exports){
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

},{"../../common/lib/utils":2}],6:[function(require,module,exports){
'use strict'

/* globals $ */

async function jqueryJira (auth = {}, method = 'GET', request = 'api/2/myself', input) {
  // auth = {jira, credentials, agent}
  if (auth.jira === undefined) { throw new Error('jira url is undefined') }

  // jquery parameters
  const url = auth.jira + '/rest/' + request
  const data = input && JSON.stringify(input)
  const [type, crossDomain, contentType, dataType, async, xhrFields] = // use dataType over accept
    [method, true, 'application/json', 'json', true, {withCredentials: true}]

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
    $.ajax({type, url, crossDomain, contentType, dataType, async, data, xhrFields, success, error, complete})
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

/* globals webix */

const { nonVoids } = require('../../common/lib/utils')

async function webixJira (auth = {}, method = 'GET', request = 'api/2/myself', input) {
  // auth = {jira, credentials, agent}
  if (auth.jira === undefined) { throw new Error('jira url is undefined') }

  // webix parameters
  const url = auth.jira + '/rest/' + request
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

},{"../../common/lib/utils":2}],8:[function(require,module,exports){
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

},{"../../common/lib/utils":2}],9:[function(require,module,exports){
'use strict'

const { story } = require('./env/index')
const { main: calls } = require('./stories/calls')
const { main: errors } = require('./stories/errors')

function runStory () {
  switch (story) {
    case 1:
      console.log('Running calls()...')
      return calls()
    case 0:
    default:
      console.log('Running errors()...')
      return errors()
  }
}

runStory()

},{"./env/index":4,"./stories/calls":10,"./stories/errors":11}],10:[function(require,module,exports){
'use strict'

const { getEnvAuth, contactJira, trycatch } = require('../env/index')

// https://atlassian-test.hq.k.grp/jira/plugins/servlet/restbrowser
// GET priorities (OK as anonymous, as long as no credentials is passed)
// GET myself (must be logged in)
// POST new issue
// POST new comment
// GET new comment
// PUT update to comment
// GET updated comment
// DELETE comment

async function calls () {
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

function main () {
  trycatch(calls)
}

module.exports = { main }

},{"../env/index":4}],11:[function(require,module,exports){
'use strict'

const { getEnvAuth, contactJira, trycatch } = require('../env/index')

// Errors from fetch()
// Errors without a response json
// Errors with an errorMessages[] array in the response json
// Errors with an errors{} object in the response json

const auth = getEnvAuth()
let priorities, myself

async function connect () {
  priorities = await contactJira(auth, 'GET', 'api/2/priority').then((json) => { return json.map(o => o.name) })
  console.log('JIRA priorities are:', priorities)

  const { name } = await contactJira(auth)
  myself = name
  console.log('I am', myself)

  errors()
}

async function error1 () {
  let myauth = getEnvAuth()
  myauth.jira = 'http://atlassian-fake.com/jira' // bad url
  myauth.agent = undefined

  const { name: myself } = await contactJira(myauth)
  console.log('I am', myself)
}

async function error2 () {
  let myauth = getEnvAuth()
  myauth.jira = 'https://atlassian-test.hq.k.grp/jira' // this url must be valid
  myauth.agent = undefined // missing agent for https (or extra agent for http)

  const { name: myself } = await contactJira(myauth)
  console.log('I am', myself)
}

async function error3 () {
  let myauth = getEnvAuth()
  myauth.credentials = 'undefined' // bad credentials

  const { name: myself } = await contactJira(myauth)
  console.log('I am', myself)
}

async function error4 () {
  const { key: projectkey } = await contactJira(auth, 'GET', 'api/2/_project_') // bad api
  console.log('queried project:', projectkey, auth.jira + '/projects/' + projectkey)
}

async function error5 () {
  const { key: projectkey } = await contactJira(auth, 'GET', 'api/2/project/_WEIRD_') // bad project key
  console.log('queried project:', projectkey, auth.jira + '/projects/' + projectkey)
}

async function error6 () {
  const { key: issuekey } = await contactJira(auth, 'GET', 'api/2/issue/_WEIRD-0_') // bad issue key
  console.log('queried issue:', issuekey, auth.jira + '/browse/' + issuekey)
}

async function error7 () {
  const { key: issuekey } = await contactJira(auth, 'POST', 'api/2/issue', {
    'fields': {
      // 'project': {'key': 'SPLPRJ'}, // no project
      'assignee': {'name': myself},
      'issuetype': {'name': 'Task'},
      'priority': {'name': priorities[1]},
      'summary': 'Submit issue through fetch',
      'description': ''
    }
  })
  console.log('submitted issue:', issuekey, auth.jira + '/browse/' + issuekey)
}

async function error8 () {
  const { key: issuekey } = await contactJira(auth, 'POST', 'api/2/issue', {
    'fields': {
      'project': {'key': 'SPLPRJ'},
      'assignee': {'name': myself},
      // 'issuetype': {'name': 'Task'}, // no issue type
      'priority': {'name': priorities[1]},
      'summary': 'Submit issue through fetch',
      'description': ''
    }
  })
  console.log('submitted issue:', issuekey, auth.jira + '/browse/' + issuekey)
}

async function error9 () {
  const { key: issuekey } = await contactJira(auth, 'POST', 'api/2/issue', {
    'fields': {
      'project': {'key': 'SPLPRJ'},
      'assignee': {'name': myself},
      'issuetype': {'name': 'Task'},
      'priority': {'name': priorities[1]},
      // 'summary': 'Submit issue through fetch', // no summary
      'description': ''
    }
  })
  console.log('submitted issue:', issuekey, auth.jira + '/browse/' + issuekey)
}

async function error10 () {
  const { key: issuekey } = await contactJira(auth, 'POST', 'api/2/issue', {
    'fields': {
      'project': {'key': 'SPLPRJ'},
      'assignee': {'name': myself},
      'issuetype': {'name': 'Task'},
      'priority': {'name': '_Blocker_'}, // bad priority
      'summary': 'Submit issue through fetch',
      'description': ''
    }
  })
  console.log('submitted issue:', issuekey, auth.jira + '/browse/' + issuekey)
}

async function error11 () {
  const { key: issuekey } = await contactJira(auth, 'POST', 'api/2/issue', {
    'fields': {
      'project': {'key': 'SPLPRJ'},
      'assignee': {'name': '_myself_'}, // bad assignee
      'issuetype': {'name': 'Task'},
      'priority': {'name': priorities[1]},
      'summary': 'Submit issue through fetch',
      'description': ''
    }
  })
  console.log('submitted issue:', issuekey, auth.jira + '/browse/' + issuekey)
}

async function error12 () {
  const { key: issuekey } = await contactJira(auth, 'POST', 'api/2/issue', {
    'fields': {
      'project': {'key': 'SPLPRJ'},
      '_project_': {'key': 'SPLPRJ'}, // bad attribute key
      'assignee': {'name': myself},
      'issuetype': {'name': 'Task'},
      'priority': {'name': priorities[1]},
      'summary': 'Submit issue through fetch',
      'description': ''
    }
  })
  console.log('submitted issue:', issuekey, auth.jira + '/browse/' + issuekey)
}

async function error13 () {
  const { key: issuekey } = await contactJira(auth, 'POST', 'api/2/issue', {
    'fields': {
      'project': {'key': 'SPLPRJ'},
      'assignee': {'name': myself},
      'issuetype': {'name': 'Task'},
      'priority': priorities[1], // bad attribute value
      'summary': 'Submit issue through fetch',
      'description': ''
    }
  })
  console.log('submitted issue:', issuekey, auth.jira + '/browse/' + issuekey)
}

async function error14 () {
  const { key: issuekey } = await contactJira(auth, 'POST', 'api/2/issue', {
    'fields': {
      'label': {'_key_': 'weird'}, // bad attribute value
      'project': {'key': 'SPLPRJ'},
      'assignee': {'name': myself},
      'issuetype': {'name': 'Task'},
      'priority': {'name': priorities[1]},
      'summary': 'Submit issue through fetch',
      'description': ''
    }
  })
  console.log('submitted issue:', issuekey, auth.jira + '/browse/' + issuekey)
}

async function error15 () {
  const { key: issuekey } = await contactJira(auth, 'POST', 'api/2/issue', {
    'fields': {
      'version': {'_key_': 'weird'}, // bad attribute value
      'project': {'key': 'SPLPRJ'},
      'assignee': {'name': myself},
      'issuetype': {'name': 'Task'},
      'priority': {'name': priorities[1]},
      'summary': 'Submit issue through fetch',
      'description': ''
    }
  })
  console.log('submitted issue:', issuekey, auth.jira + '/browse/' + issuekey)
}

function main () {
  trycatch(connect)
}

function errors () {
  trycatch(error1)
  trycatch(error2)
  trycatch(error3)
  trycatch(error4)
  trycatch(error5)
  trycatch(error6)
  trycatch(error7)
  trycatch(error8)
  trycatch(error9)
  trycatch(error10)
  trycatch(error11)
  trycatch(error12)
  trycatch(error13)
  trycatch(error14)
  trycatch(error15)
}

module.exports = { main }

},{"../env/index":4}]},{},[9]);
