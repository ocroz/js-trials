(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'
/* globals fetch */

async function getEnvAuth () {
  console.log('Running under browser')
  const [vone, credentials, agent] = [
    'https://safetest.hq.k.grp/Safetest', undefined, undefined
  ]
  return {getFetch, vone, credentials, agent}
}

function getFetch () {
  return fetch
}

module.exports = { getEnvAuth }

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
'use strict'

async function _voneFetch (auth = {}, method = 'GET', request = 'rest-1.v1/Data/Scope/0', input) {
  // auth = {getFetch, vone, credentials, agent}
  if (auth.getFetch === undefined) { throw new Error('voneFetch: getFetch() is undefined') }
  if (auth.vone === undefined) { auth.vone = 'https://safetest.hq.k.grp/Safetest' }

  // fetch parameters
  const fetch = auth.getFetch()
  const url = auth.vone + '/' + request
  const body = input && JSON.stringify(input)
  const headers = auth.credentials
    ? { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': auth.credentials }
    : { 'Accept': 'application/json', 'Content-Type': 'application/json' }
  const [mode, credentials, agent] = ['cors', 'include', auth.agent]
  // console.log(url, method, body, headers, mode, credentials, agent)

  // fetch promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    fetch(url, {method, body, headers, mode, credentials, agent})
    .then(resp => {
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
        const whoami = resp.headers.get('V1-MemberID')
        if (resp.status === 204) { // means statusText === 'No Content'
          resolve({whoami, data: response})
        } else {
          // resp.json().then(json => { resolve(json) })
          // resp.text().then(text => { resolve(text) })
          resp.json()
          .catch(() => {
            if (resp._raw.length > 0) {
              const data = resp._raw.toString()
              resolve({whoami, data})
            } else {
              resolve({whoami, data: response})
            }
          }).then(data => resolve({whoami, data}))
        }
      }
    })
    .catch(err => reject(err))
    .then(() => {
      console.log('END OF REST CALL')
    })
  })
}

async function getWhoAmI (auth, method, request, input) {
  return _voneFetch(auth, method, request, input).then(res => res.whoami)
}

async function voneFetch (auth, method, request, input) {
  return _voneFetch(auth, method, request, input).then(res => res.data)
}

module.exports = { voneFetch, getWhoAmI }

},{}],4:[function(require,module,exports){
'use strict'

const { getEnvAuth } = require('./env/index')
const { trycatch } = require('./lib/trycatch')
const { voneFetch, getWhoAmI } = require('./lib/vonefetch')

let auth = {}
async function main () {
  auth = await getEnvAuth()
  const memberId = await getWhoAmI(auth).then(whoami => whoami.split('/')[1])
  console.log('My memberId is:', memberId)

  auth = await getEnvAuth()
  const myself = await voneFetch(auth, 'GET', `rest-1.v1/Data/Member/${memberId}`).then(mydetails => mydetails.Attributes.Name.value)
  console.log('I am:', myself)

  auth = await getEnvAuth()
  const scope = await voneFetch(auth, 'GET', 'rest-1.v1/Data/Scope/0')
  console.log('Scope type is:', scope._type)

  auth = await getEnvAuth()
  const teams = await voneFetch(auth, 'GET', 'rest-1.v1/Data/Team?sel=Name,Inactive')
  console.log('Teams type is:', teams._type)
}

trycatch(main)

},{"./env/index":1,"./lib/trycatch":2,"./lib/vonefetch":3}]},{},[4]);
