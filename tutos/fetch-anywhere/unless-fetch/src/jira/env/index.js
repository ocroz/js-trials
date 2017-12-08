'use strict'

const fetch = require('node-fetch')
const https = require('https')
const { kgcerts } = require('../../common/lib/kgcerts')
const { trycatch } = require('../../common/lib/trycatch')
const { fetchJira } = require('../lib/anywhere-fetch')

const altFetchCase = process.argv[2] || 0 // 0=fetch, 1=http, 2=https, 3=request

function getEnvAuth () {
  console.log('Running under node.js')
  const [jira, username, password] = [
    process.argv[3] || 'https://atlassian-test.hq.k.grp/jira',
    process.argv[4] || process.env.USERNAME,
    process.argv[5] || process.env.pw
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

function contactJira (...args) {
  switch (altFetchCase) {
    case 0:
    default:
      console.log('Contacting JIRA via fetchJira()...')
      return fetchJira(...args)
  }
}

module.exports = { getEnvAuth, contactJira, trycatch }
