'use strict'

require('colors')
const fetch = require('node-fetch')
const http = require('http')
const https = require('https')
const { trycatch } = require('../../common/trycatch')
const { fetchVone } = require('../lib/anywhere-fetch')
const { httpntlmVone } = require('../lib/node-httpntlm')
const { httpreqVone } = require('../lib/node-httpreq')
const { httpVone } = require('../lib/node-http')
const { httpsVone } = require('../lib/node-https')
const { requestVone } = require('../lib/node-request')
const { ntlmHandshake: ntlmHandshakeFetch } = require('../ntlm/handshake-fetch')

console.log('Running under node.js')

const voneConfig = require('./node-config')
voneConfig.agent = getAgent(voneConfig.voneUrl, voneConfig.ca)

function getVoneConfig () {
  const { voneUrl, agent, nonVoids } = voneConfig
  return {voneUrl, getFetch, getAuthOpts, getAuthHeader, fixUrl, logError, agent, nonVoids}
}

function getFetch () {
  return fetch
}

function getAuthOpts () {
  const { username, password, domain, workstation } = voneConfig
  return { username, password, domain, workstation }
}

async function getAuthHeader (ntlmHandshake = ntlmHandshakeFetch) {
  // Note: The Cookie authentication fails in node.js with VersionOne

  switch (voneConfig.authMethod) {
    case 'Cookie':
      console.log('Using Cookie authentication...')
      return { name: 'Cookie', data: voneConfig.cookie }
    case 'OAuth2':
      console.log('Using OAuth2 authentication...')
      return { name: 'Authorization', data: 'Bearer ' + voneConfig.oauthToken }
    case 'NTLM':
    default:
      console.log('Using NTLM authentication...')
      const { voneUrl, username, password, domain, workstation, agent } = voneConfig
      return {
        name: 'Authorization',
        data: await ntlmHandshake(voneUrl, { username, password, domain, workstation }, agent)
      }
  }
}

function getAgent (url, ca) {
  return !url.match(/^https:/)
    ? new http.Agent({ keepAlive: true }) // http agent
    : ca === undefined
    ? new https.Agent({ keepAlive: true, rejectUnauthorized: false })
    : new https.Agent({ keepAlive: true, rejectUnauthorized: true, ca })
}

function fixUrl (req) {
  const { from, to } = voneConfig.urlFix || {}
  return (from && to) ? req.replace(from, to) : req
}

function logError (...args) {
  console.error(args.join(' ').red)
}

function contactVone (...args) {
  switch (voneConfig.altFetchCase) {
    case 1:
      console.log('Contacting VersionOne via httpntlmVone()...')
      return httpntlmVone(...args)
    case 2:
      console.log('Contacting VersionOne via httpreqVone()...')
      return httpreqVone(...args)
    case 3:
      console.log('Contacting VersionOne via httpVone()...')
      return httpVone(...args)
    case 4:
      console.log('Contacting VersionOne via httpsVone()...')
      return httpsVone(...args)
    case 5:
      console.log('Contacting VersionOne via requestVone()...')
      return requestVone(...args)
    case 0:
    default:
      console.log('Contacting VersionOne via fetchVone()...')
      return fetchVone(...args)
  }
}

module.exports = { story: voneConfig.story, getVoneConfig, contactVone, trycatch }
