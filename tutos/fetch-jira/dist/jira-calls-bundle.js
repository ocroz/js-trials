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

  const priorities = await jiraFetch(auth, 'GET', 'api/2/priority').then((json) => { return json.map(o => o.name) })
  console.log('JIRA priorities are:', priorities)

  const { name: myself } = await jiraFetch(auth)
  console.log('I am', myself)

  const { key: issuekey } = await jiraFetch(auth, 'POST', 'api/2/issue', {
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

  const { id: commentid } = await jiraFetch(auth, 'POST', 'api/2/issue/' + issuekey + '/comment', {
    'body': 'nice comment submitted through fetch'
  })
  console.log('submitted comment:', commentid)

  const { id: cid, body: cbody } = await jiraFetch(auth, 'GET', 'api/2/issue/' + issuekey + '/comment/' + commentid)
  console.log('comment is:', cid, cbody)

  const { id: pid, body: pbody } = await jiraFetch(auth, 'PUT', 'api/2/issue/' + issuekey + '/comment/' + commentid, {
    'body': 'nice comment updated through fetch'
  })
  console.log('comment is:', pid, pbody)

  const { id: uid, body: ubody } = await jiraFetch(auth, 'GET', 'api/2/issue/' + issuekey + '/comment/' + commentid)
  console.log('comment is:', uid, ubody)

  const res = await jiraFetch(auth, 'DELETE', 'api/2/issue/' + issuekey + '/comment/' + commentid)
  console.log('comment deleted with status:', res)
}

trycatch(main)

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
            if ((Array.isArray(json[attr]) && json[attr].length > 0) || (Object.keys(json[attr]).length > 0)) {
              err[attr] = json[attr]
            }
          }
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
