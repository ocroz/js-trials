(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function trycatch (...args) {
  console.log('launching async processes')
  _trycatch(...args)
  console.log('async processes launched')
}

async function _trycatch (fn, cb) {
  try {
    await fn()
    console.log('async processes succeeded, nothing more to do, leaving script')
  } catch (err) {
    console.error('async processes failed with error:', err.message)
  }
  cb && cb()
}

module.exports = { trycatch }

},{}],2:[function(require,module,exports){
'use strict'

function nonVoids (input) {
  let output = {}
  for (let attr in input) {
    if (input[attr] && Object.keys(input[attr]).length > 0) { // if defined, input[attr] is either array or object or string
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
  "voneUrl": "https://versionone.mycompagny/core"
}

},{}],4:[function(require,module,exports){
'use strict'

/* global fetch */

const { trycatch } = require('../../common/trycatch')
const { nonVoids } = require('../../common/utils')
const { fetchVone } = require('../lib/anywhere-fetch')
const { jqueryVone } = require('../lib/browser-jquery')
const { webixVone } = require('../lib/browser-webix')
const { xhrVone } = require('../lib/browser-xhr')
// const { ntlmHandshake } = require('../ntlm/ntlm-handshake')

const voneConfig = require('../cfg/vone-config.json')

console.log('Running under browser')

// const story = 0 // 0=errors.js, 1=issue.js
// const altFetchCase = 0 // 0=fetch, 1=jquery, 2=xhr, 3=webix
const [ story, altFetchCase, voneUrl ] = [ // browserify uses envify for process.env
  Number(undefined) || voneConfig.story,
  Number(undefined) || voneConfig.altFetchCase,
  undefined || voneConfig.voneUrl
]
console.log({story, altFetchCase, voneUrl})

function getVoneConfig () {
  return {getFetch, voneUrl, getAuthHeader, fixUrl, logError, nonVoids}
}

function getAuthHeader (url, method) {
  // Only the Cookie authentication works in the browser with VersionOne
  // Because the header 'Authorization' is not allowed

  return undefined
}

function getFetch () {
  return fetch
}

function fixUrl (req) {
  return req
}

function logError () {
  return undefined
}

function contactVone (...args) {
  switch (altFetchCase) {
    case 1:
      console.log('Contacting VersionOne via jqueryVone()...')
      return jqueryVone(...args)
    case 2:
      console.log('Contacting VersionOne via xhrVone()...')
      return xhrVone(...args)
    case 3:
      console.log('Contacting VersionOne via webixVone()...')
      return webixVone(...args)
    case 0:
    default:
      console.log('Contacting VersionOne via fetchVone()...')
      return fetchVone(...args)
  }
}

module.exports = { story: voneConfig.story, getVoneConfig, contactVone, trycatch }

},{"../../common/trycatch":1,"../../common/utils":2,"../cfg/vone-config.json":3,"../lib/anywhere-fetch":5,"../lib/browser-jquery":6,"../lib/browser-webix":7,"../lib/browser-xhr":8}],5:[function(require,module,exports){
'use strict'

async function _fetchVone (voneConfig = {}, method = 'GET', request = 'rest-1.v1/Data/Scope/0', input) {
  // voneConfig = {voneUrl, getFetch, getAuthHeader, fixUrl, logError, agent, nonVoids} // header and agent are undefined in browser
  for (let attr of ['voneUrl', 'getFetch', 'getAuthHeader', 'fixUrl', 'logError', 'nonVoids']) {
    if (!voneConfig[attr]) { throw new Error(`fetchVone: ${attr} is undefined`) }
  }
  const { voneUrl, getFetch, getAuthHeader, fixUrl, logError, agent, nonVoids } = voneConfig

  // fetch parameters
  const fetch = getFetch()
  const url = voneUrl + '/' + fixUrl(request)
  const body = input && JSON.stringify(input)
  const authHeader = await getAuthHeader()
  const headers = authHeader
    ? { 'Accept': 'application/json', 'Content-Type': 'application/json', [authHeader.name]: authHeader.data }
    : { 'Accept': 'application/json', 'Content-Type': 'application/json' }
  const [mode, credentials] = ['cors', 'include']
  // console.log(url, method, body, headers, mode, credentials, agent)

  // fetch promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    fetch(url, {method, body, headers, mode, credentials, agent})
    .catch(err => {
      logError(method, url, 'internal fetch error')
      reject(err)
    })
    .then(resp => {
      const { ok, status, statusText } = resp
      const response = { ok, status, statusText }
      const whoami = resp.headers.get('V1-MemberID')
      if (status === 204) { // means statusText === 'No Content'
        resolve({whoami, data: response})
      } else if (ok) {
        resp.json().then(data => resolve({whoami, data}))
      } else {
        resp.json().catch(() => response).then(data => { // VersionOne sends an html page on unauthorized requests
          const err = nonVoids(data)
          logError(method, url, status, statusText)
          reject(new Error(JSON.stringify(err)))
        })
      }
    })
    .catch(err => reject(err))
    .then(() => {
      console.log('END OF REST CALL')
    })
  })
}

function fetchVone (voneConfig, method, request, input) {
  return (method && request)
    ? _fetchVone(voneConfig, method, request, input).then(res => res.data)
    : _fetchVone(voneConfig, method, request, input).then(res => res.whoami)
}

module.exports = { fetchVone }

},{}],6:[function(require,module,exports){
'use strict'

/* globals $ */

async function _jqueryVone (voneConfig = {}, method = 'GET', request = 'rest-1.v1/Data/Scope/0', input) {
  // voneConfig = {voneUrl, nonVoids} // header and agent are undefined in browser
  for (let attr of ['voneUrl', 'nonVoids']) {
    if (!voneConfig[attr]) { throw new Error(`jqueryVone: ${attr} is undefined`) }
  }
  const { voneUrl, nonVoids } = voneConfig

  // jquery parameters
  const url = voneUrl + '/' + request
  const data = input && JSON.stringify(input)
  const [type, crossDomain, contentType, dataType, async, xhrFields] = // use dataType over accept
    [method, true, 'application/json', 'json', true, {withCredentials: true}]

  // jquery promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    function success (body, textStatus, result) {
      const { status, statusText } = result
      const data = (status === 204) ? { textStatus, status, statusText } : body // 204 means statusText === 'No Content'
      const whoami = result.getResponseHeader('v1-memberid')
      resolve({whoami, data})
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

function jqueryVone (voneConfig, method, request, input) {
  return (method && request)
    ? _jqueryVone(voneConfig, method, request, input).then(res => res.data)
    : _jqueryVone(voneConfig, method, request, input).then(res => res.whoami)
}

module.exports = { jqueryVone }

},{}],7:[function(require,module,exports){
'use strict'

/* globals webix */

async function _webixVone (voneConfig = {}, method = 'GET', request = 'rest-1.v1/Data/Scope/0', input) {
  // voneConfig = {voneUrl, nonVoids} // header and agent are undefined in browser
  for (let attr of ['voneUrl', 'nonVoids']) {
    if (!voneConfig[attr]) { throw new Error(`webixVone: ${attr} is undefined`) }
  }
  const { voneUrl, nonVoids } = voneConfig

  // webix parameters
  const url = voneUrl + '/' + request
  const body = input && JSON.stringify(input)

  // webix promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    function onBeforeAjax (mode, url, data, request, headers, files, promise) {
      request.withCredentials = true // request = xhr
      headers['Accept'] = 'application/json'
      headers['Content-type'] = 'application/json'
    }
    function success (text, body, ajax) {
      const { status, statusText } = ajax
      const data = text ? body.json() : { success: true, status, statusText }
      const whoami = ajax.getResponseHeader('v1-memberid')
      resolve({whoami, data})
    }
    function error (text, body, ajax) {
      text && reject(new Error(JSON.stringify(nonVoids(body.json()))))
      reject(new Error('Internal webix error'))
    }
    function complete () {
      console.log('END OF REST CALL')
    }
    webix.attachEvent('onBeforeAjax', onBeforeAjax)
    try {
      webix.ajax()[method.toLowerCase().replace('delete', 'del')](url, body, {error, success}).then(complete)
    } catch (err) {
      reject(new Error(`${err}\n on request ${JSON.stringify({url, method, body})}`))
    }
  })
}

function webixVone (voneConfig, method, request, input) {
  return (method && request)
    ? _webixVone(voneConfig, method, request, input).then(res => res.data)
    : _webixVone(voneConfig, method, request, input).then(res => res.whoami)
}

module.exports = { webixVone }

},{}],8:[function(require,module,exports){
'use strict'

/* globals XMLHttpRequest */

async function _xhrVone (voneConfig = {}, method = 'GET', request = 'rest-1.v1/Data/Scope/0', input) {
  // voneConfig = {voneUrl, nonVoids} // header and agent are undefined in browser
  for (let attr of ['voneUrl', 'nonVoids']) {
    if (!voneConfig[attr]) { throw new Error(`xhrVone: ${attr} is undefined`) }
  }
  const { voneUrl, nonVoids } = voneConfig

  // xhr parameters
  const url = voneUrl + '/' + request
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
      const body = xhr.response && JSON.parse(xhr.response)
      const data = (xhr.status === 204) ? { success, status, statusText } : body // 204 means statusText === 'No Content'
      const whoami = xhr.getResponseHeader('v1-memberid')
      if (success) {
        resolve({whoami, data})
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

function xhrVone (voneConfig, method, request, input) {
  return (method && request)
    ? _xhrVone(voneConfig, method, request, input).then(res => res.data)
    : _xhrVone(voneConfig, method, request, input).then(res => res.whoami)
}

module.exports = { xhrVone }

},{}],9:[function(require,module,exports){
'use strict'

const { story } = require('./env/index')
const { main: errors } = require('./stories/errors')
const { main: info } = require('./stories/info')

function runStory () {
  switch (story) {
    case 1:
      console.log('Running info()...')
      return info()
    case 0:
    default:
      console.log('Running errors()...')
      return errors()
  }
}

runStory()

},{"./env/index":4,"./stories/errors":10,"./stories/info":11}],10:[function(require,module,exports){
'use strict'

const { getVoneConfig, contactVone, trycatch } = require('../env/index')

let voneConfig = {}
let memberId, myself, authHeader
let runErrors = false

async function connect () {
  voneConfig = getVoneConfig()
  memberId = await contactVone(voneConfig).then(whoami => whoami.split('/')[1])
  console.log('My memberId is:', memberId)

  authHeader = await voneConfig.getAuthHeader() // Get a NTLM token...
  voneConfig = getVoneConfig()
  voneConfig.getAuthHeader = () => authHeader // ...and consume it (see error4 below)
  myself = await contactVone(voneConfig, 'GET', `rest-1.v1/Data/Member/${memberId}`).then(mydetails => mydetails.Attributes.Name.value)
  console.log('I am:', myself)

  runErrors = true
}

async function error1 () {
  voneConfig = getVoneConfig()
  voneConfig.voneUrl = 'https://safefake.com/Safefake' // bad url
  const scope = await contactVone(voneConfig, 'GET', 'rest-1.v1/Data/Scope/0')
  console.log('Scope type is:', scope._type)
}

async function error2 () { // produces an error in node only (excepted with httpntlm) => this passes in the browser
  voneConfig = getVoneConfig()
  voneConfig.agent = undefined // missing agent for http or https
  const scope = await contactVone(voneConfig, 'GET', 'rest-1.v1/Data/Scope/0')
  console.log('Scope type is:', scope._type)
}

async function error3 () { // produces an error in node only => this passes in the browser
  voneConfig = getVoneConfig()
  let authOpts = voneConfig.getAuthOpts()
  Object.keys(authOpts).map(key => { authOpts[key] = '' })
  voneConfig.getAuthOpts = () => authOpts // bad credentials for node httpntlm lib
  voneConfig.getAuthHeader = () => undefined // bad credentials for other node libs
  const scope = await contactVone(voneConfig, 'GET', 'rest-1.v1/Data/Scope/0')
  console.log('Scope type is:', scope._type)
}

async function error4 () { // produces an error in node only (excepted with httpntlm) => this passes in the browser
  voneConfig = getVoneConfig()
  voneConfig.getAuthHeader = () => authHeader // We don't get any new NTLM token
  const teams = await contactVone(voneConfig, 'GET', 'rest-1.v1/Data/Team?sel=Name,Inactive')
  console.log('Teams type is:', teams._type) // This fails because the NTLM token was consumed already
}

async function error5 () {
  voneConfig = getVoneConfig()
  const teams = await contactVone(voneConfig, 'GET', 'rest-1.v1/Data/_Team_') // bad api
  console.log('Teams type is:', teams._type)
}

async function error6 () {
  voneConfig = getVoneConfig()
  const memberId = await contactVone(voneConfig, 'GET', 'rest-1.v1/Data/Member/_0000_') // bad memberId
  console.log('I am:', memberId.Attributes.Name.value)
}

async function error7 () {
  voneConfig = getVoneConfig()
  const memberId = await contactVone(voneConfig, 'GET', 'rest-1.v1/Data/Member/0000') // unknown memberId
  console.log('I am:', memberId.Attributes.Name.value)
}

async function error8 () {
  voneConfig = getVoneConfig()
  const memberId = await contactVone(voneConfig, 'DELETE', 'rest-1.v1/Data/Member/0000') // bad method
  console.log('I am:', memberId.Attributes.Name.value)
}

async function error9 () {
  voneConfig = getVoneConfig()
  const memberId = await contactVone(voneConfig, 'POST', 'rest-1.v1/Data/Member/0000') // missing body
  console.log('I am:', memberId.Attributes.Name.value)
}

async function error10 () {
  voneConfig = getVoneConfig()
  const memberId = await contactVone(voneConfig, 'POST', 'rest-1.v1/Data/Member/0000', { // unknown memberId
    Attributes: {
      Name: { value: 'Andre Agile', act: 'set' }
    }
  })
  console.log('I am:', memberId.Attributes.Name.value)
}

async function error11 () {
  voneConfig = getVoneConfig()
  const memberId = await contactVone(voneConfig, 'POST', 'rest-1.v1/Data/Member', {
    Attributes: {
      Name: { value: 'Andre Agile', act: 'set' } // missing default role
    }
  })
  console.log('I am:', memberId.Attributes.Name.value)
}

async function error12 () {
  voneConfig = getVoneConfig()
  const memberId = await contactVone(voneConfig, 'POST', 'rest-1.v1/Data/Member', {
    Attributes: {
      // Name: { value: 'Andre Agile', act: 'set' },
      DefaultRole: { value: { 'href': '/Safetest/rest-1.v1/Data/Role/4', 'idref': 'Role:4' }, act: 'set' } // missing NickName
    }
  })
  console.log('I am:', memberId.Attributes.Name.value)
}

async function error13 () {
  voneConfig = getVoneConfig()
  const memberId = await contactVone(voneConfig, 'POST', 'rest-1.v1/Data/Member', {
    Attributes: {
      _Name_: { value: 'Andre Agile', act: 'set' }, // bad key
      DefaultRole: { value: { 'href': '/Safetest/rest-1.v1/Data/Role/4', 'idref': 'Role:4' }, act: 'set' }
    }
  })
  console.log('I am:', memberId.Attributes.Name.value)
}

function main () {
  trycatch(connect, errors)
}

function errors () {
  const tcerr1 = () => trycatch(error1, tcerr2)
  const tcerr2 = () => trycatch(error2, tcerr3)
  const tcerr3 = () => trycatch(error3, tcerr4)
  const tcerr4 = () => trycatch(error4, tcerr5)
  const tcerr5 = () => trycatch(error5, tcerr6)
  const tcerr6 = () => trycatch(error6, tcerr7)
  const tcerr7 = () => trycatch(error7, tcerr8)
  const tcerr8 = () => trycatch(error8, tcerr9)
  const tcerr9 = () => trycatch(error9, tcerr10)
  const tcerr10 = () => trycatch(error10, tcerr11)
  const tcerr11 = () => trycatch(error11, tcerr12)
  const tcerr12 = () => trycatch(error12, tcerr13)
  const tcerr13 = () => trycatch(error13)
  if (runErrors) { tcerr1() }
}

module.exports = { main }

},{"../env/index":4}],11:[function(require,module,exports){
'use strict'

const { getVoneConfig, contactVone, trycatch } = require('../env/index')

let voneConfig = {}
async function calls () {
  voneConfig = getVoneConfig()
  const memberId = await contactVone(voneConfig).then(whoami => whoami.split('/')[1])
  console.log('My memberId is:', memberId)

  voneConfig = getVoneConfig()
  const myself = await contactVone(voneConfig, 'GET', `rest-1.v1/Data/Member/${memberId}`).then(mydetails => mydetails.Attributes.Name.value)
  console.log('I am:', myself)

  voneConfig = getVoneConfig()
  const scope = await contactVone(voneConfig, 'GET', 'rest-1.v1/Data/Scope/0')
  console.log('Scope type is:', scope._type)

  voneConfig = getVoneConfig()
  const teams = await contactVone(voneConfig, 'GET', 'rest-1.v1/Data/Team?sel=Name,Inactive')
  console.log('Teams type is:', teams._type)
}

function main () {
  trycatch(calls)
}

module.exports = { main }

},{"../env/index":4}]},{},[9]);
