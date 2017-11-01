(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// browser.js
// https://nolanlawson.com/2017/01/09/how-to-write-a-javascript-package-for-both-node-and-the-browser/
'use strict'

/* global fetch */

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

// /* global btoa */
// function base64Encode (string) {
//   return btoa(string)
// }

// function getAgent (ca) {
//   return undefined
// }

module.exports = { getEnvAuth }

},{}],2:[function(require,module,exports){
'use strict'

const { getEnvAuth } = require('./env/index')
const { jiraFetch } = require('./lib/jirafetch')
const { trycatch } = require('./lib/trycatch')

// Errors from fetch()
// Errors without a response json
// Errors with an errorMessages[] array in the response json
// Errors with an errors{} object in the response json

const auth = getEnvAuth()
let priorities, myself

async function connect () {
  priorities = await jiraFetch(auth, 'GET', 'api/2/priority').then((json) => { return json.map(o => o.name) })
  console.log('JIRA priorities are:', priorities)

  const { name } = await jiraFetch(auth)
  myself = name
  console.log('I am', myself)

  errors()
}

async function error1 () {
  let myauth = getEnvAuth()
  myauth.jira = 'http://atlassian-fake.com/jira' // bad url
  myauth.agent = undefined

  const { name: myself } = await jiraFetch(myauth)
  console.log('I am', myself)
}

async function error2 () {
  let myauth = getEnvAuth()
  myauth.jira = 'https://atlassian-test.hq.k.grp/jira' // this url must be valid
  myauth.agent = undefined // missing agent for https (or extra agent for http)

  const { name: myself } = await jiraFetch(myauth)
  console.log('I am', myself)
}

async function error3 () {
  let myauth = getEnvAuth()
  myauth.credentials = 'undefined' // bad credentials

  const { name: myself } = await jiraFetch(myauth)
  console.log('I am', myself)
}

async function error4 () {
  const { key: projectkey } = await jiraFetch(auth, 'GET', 'api/2/_project_') // bad api
  console.log('queried project:', projectkey, auth.jira + '/projects/' + projectkey)
}

async function error5 () {
  const { key: projectkey } = await jiraFetch(auth, 'GET', 'api/2/project/_WEIRD_') // bad project key
  console.log('queried project:', projectkey, auth.jira + '/projects/' + projectkey)
}

async function error6 () {
  const { key: issuekey } = await jiraFetch(auth, 'GET', 'api/2/issue/_WEIRD-0_') // bad issue key
  console.log('queried issue:', issuekey, auth.jira + '/browse/' + issuekey)
}

async function error7 () {
  const { key: issuekey } = await jiraFetch(auth, 'POST', 'api/2/issue', {
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
  const { key: issuekey } = await jiraFetch(auth, 'POST', 'api/2/issue', {
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
  const { key: issuekey } = await jiraFetch(auth, 'POST', 'api/2/issue', {
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
  const { key: issuekey } = await jiraFetch(auth, 'POST', 'api/2/issue', {
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
  const { key: issuekey } = await jiraFetch(auth, 'POST', 'api/2/issue', {
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
  const { key: issuekey } = await jiraFetch(auth, 'POST', 'api/2/issue', {
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
  const { key: issuekey } = await jiraFetch(auth, 'POST', 'api/2/issue', {
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
  const { key: issuekey } = await jiraFetch(auth, 'POST', 'api/2/issue', {
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
  const { key: issuekey } = await jiraFetch(auth, 'POST', 'api/2/issue', {
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

trycatch(connect)

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

},{"./env/index":1,"./lib/jirafetch":3,"./lib/trycatch":4}],3:[function(require,module,exports){
'use strict'

async function jiraFetch (auth = {}, method = 'GET', request = 'api/2/myself', input) {
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
          const err = {}
          for (let attr in json) {
            if (Object.keys(json[attr]).length > 0) { // json[attr] is either array or object
              err[attr] = json[attr]
            }
          }
          reject(new Error(JSON.stringify(err)))
        })
      } else {
        if (resp.status === 204) { // means statusText === 'No Content'
          resolve(response)
        } else {
          console.log(resp)
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

module.exports = { jiraFetch }

},{}],4:[function(require,module,exports){
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

},{}]},{},[2]);
