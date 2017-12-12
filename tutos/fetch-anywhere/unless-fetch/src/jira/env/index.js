'use strict'

const fs = require('fs')
const http = require('http')
const https = require('https')
const path = require('path')
const nconf = require('nconf')
const fetch = require('node-fetch')
const { trycatch } = require('../../common/lib/trycatch')
const { fetchJira } = require('../lib/anywhere-fetch')
const { httpJira } = require('../lib/node-http')
const { httpsJira } = require('../lib/node-https')
const { requestJira } = require('../lib/node-request')

console.log('Running under node.js')

// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at 'path/to/config.json'
const cfgFile = path.resolve(__dirname, '../cfg/jira-config.json')
nconf.argv().env().file({file: cfgFile})

// const story = 0 // 0=calls.js, 1=errors.js
// const altFetchCase = 0 // 0=fetch, 1=http, 2=https, 3=request
const [story, altFetchCase, jiraUrl] =
  [Number(nconf.get('story')), Number(nconf.get('altFetchCase')), nconf.get('jiraUrl')]

// Load ca.cer for https requests
const caFile = path.resolve(__dirname, '../cfg/ca.cer')
const ca = fs.existsSync(caFile)
  ? fs.readFileSync(caFile)
  : undefined

console.log({story, altFetchCase, jiraUrl, ca: ca && '...'})

function getEnvAuth () {
  const [username, password] = [nconf.get('USERNAME'), nconf.get('pw')]
  const credentials = (username && password)
    ? 'Basic ' + base64Encode(username + ':' + password)
    : undefined
  const agent = getAgent(jiraUrl, ca)
  return {getFetch, jira: jiraUrl, credentials, agent}
}

function getFetch () {
  return fetch
}

function base64Encode (string) {
  return Buffer.from(string, 'binary').toString('base64')
}

function getAgent (url, ca) {
  return !url.match(/^https:/)
    ? new http.Agent({ rejectUnauthorized: false }) // https.request() needs an agent, could be undefined for others
    : !ca
    ? new https.Agent({ rejectUnauthorized: false })
    : new https.Agent({ ca, rejectUnauthorized: true })
}

function contactJira (...args) {
  switch (altFetchCase) {
    case 1:
      console.log('Contacting JIRA via httpJira()...')
      return httpJira(...args)
    case 2:
      console.log('Contacting JIRA via httpsJira()...')
      return httpsJira(...args)
    case 3:
      console.log('Contacting JIRA via requestJira()...')
      return requestJira(...args)
    case 0:
    default:
      console.log('Contacting JIRA via fetchJira()...')
      return fetchJira(...args)
  }
}

module.exports = { story, getEnvAuth, contactJira, trycatch }
