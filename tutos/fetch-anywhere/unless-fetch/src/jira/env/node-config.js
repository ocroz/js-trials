'use strict'

const fs = require('fs')
const path = require('path')
const nconf = require('nconf')
const { nonVoids } = require('../../common/lib/utils')

// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at 'path/to/config.json'
const cfgFile = path.resolve(__dirname, '../cfg/jira-config.json')
nconf.argv().env().file({file: cfgFile})

// const story = 0 // 0=errors.js, 1=issue.js
// const altFetchCase = 0 // 0=fetch, 1=http, 2=https, 3=request
const [story, altFetchCase, jiraUrl] =
  [Number(nconf.get('story')), Number(nconf.get('altFetchCase')), nconf.get('jiraUrl')]

// const authMethod = 'Cookie', 'Basic', 'OAuth1'
const [authMethod, consumerKey, oauthToken, oauthTokenSecret, cookie] =
  [nconf.get('authMethod'), nconf.get('consumerKey'), nconf.get('oauthToken'), nconf.get('oauthTokenSecret'), nconf.get('cookie')]

// Basic credentials in case no other auth method is provided
const [username, password] = [nconf.get('USERNAME'), nconf.get('pw')]
const basicCredentials = (username && password) && 'Basic ' + base64Encode(username + ':' + password)

// Load consumer.pem for OAuth1 requests
const pemFile = path.resolve(__dirname, '../cfg/consumer.pem')
const privateKey = fs.existsSync(pemFile) ? fs.readFileSync(pemFile) : undefined

// Load ca.cer for https requests
const caFile = path.resolve(__dirname, '../cfg/ca.cer')
const ca = fs.existsSync(caFile) ? fs.readFileSync(caFile) : undefined

// Log jiraConfig
const credentials = nonVoids({authMethod, consumerKey, oauthToken, oauthTokenSecret, cookie})
credentials.privateKey = privateKey && '...'
console.log({story, altFetchCase, jiraUrl, credentials, ca: ca && '...'})

function base64Encode (string) {
  return Buffer.from(string, 'binary').toString('base64')
}

module.exports = { story, altFetchCase, jiraUrl, authMethod, consumerKey, oauthToken, oauthTokenSecret, cookie, basicCredentials, privateKey, ca, nonVoids }
