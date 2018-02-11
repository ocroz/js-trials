// index.js
// https://nolanlawson.com/2017/01/09/how-to-write-a-javascript-package-for-both-node-and-the-browser/
'use strict'

const fetch = require('node-fetch')
const https = require('https')
const { kgcerts } = require('./kgcerts')

const port = process.env.PORT || 4000
const jiraport = process.env.PORT || 4545 // we use app-mock-jira

function getEnvAuth () {
  console.log('Running under node.js')
  const [jira, username, password] = [
    process.argv[2] || `http://localhost:${jiraport}/jira`,
    process.argv[3] || process.env.USERNAME,
    process.argv[4] || process.env.pw
  ]
  const credentials = (username !== undefined && password !== undefined)
    ? 'Basic ' + base64Encode(username + ':' + password)
    : undefined
  const agent = getAgent(jira, kgcerts)
  return {getFetch, jira, credentials, agent}
}

function getFetch () {
  return fetch
}

function base64Encode (string) {
  return Buffer.from(string, 'binary').toString('base64')
}

function getAgent (url, ca) {
  return !url.match(/^https:/)
    ? undefined
    : ca !== undefined
    ? new https.Agent({ ca, rejectUnauthorized: true })
    : new https.Agent({ rejectUnauthorized: false })
}

module.exports = { getEnvAuth, port }
