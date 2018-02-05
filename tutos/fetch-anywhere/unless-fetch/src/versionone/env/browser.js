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
  Number(process.env.story) || voneConfig.story,
  Number(process.env.altFetchCase) || voneConfig.altFetchCase,
  process.env.voneUrl || voneConfig.voneUrl
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
