// index.js
// https://nolanlawson.com/2017/01/09/how-to-write-a-javascript-package-for-both-node-and-the-browser/
'use strict'

const fetch = require('node-fetch')
const https = require('https')
const { kgcerts } = require('./kgcerts')

function getEnvAuth () {
  console.log('Running under node.js')
  const [jira, username, password] = [
    process.argv[2] || 'https://atlassian-test.hq.k.grp/jira',
    process.argv[3] || process.env.USERNAME,
    process.argv[4] || process.env.pw
  ]
  const credentials = (username !== undefined && password !== undefined)
    ? 'Basic ' + base64Encode(username + ':' + password)
    : undefined
  const agent = getAgent(kgcerts)
  return {getFetch, jira, credentials, agent}
}

function getFetch () {
  return fetch
}

function base64Encode (string) {
  return Buffer.from(string, 'binary').toString('base64')
}

function getAgent (ca) {
  return ca !== undefined
    ? new https.Agent({ ca, rejectUnauthorized: true })
    : new https.Agent({ rejectUnauthorized: false })
}

module.exports = { getEnvAuth }
