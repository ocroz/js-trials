'use strict'

const fs = require('fs')
const path = require('path')
const nconf = require('nconf')
const { getOAuth1Header } = require('../../oauth1-headers')

// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at 'path/to/config.json'
const cfgFile = path.resolve(__dirname, '../cfg/jira-config.json')
nconf.argv().env().file({file: cfgFile})

const [jiraUrl, request] = [nconf.get('jiraUrl'), nconf.get('request')]
const url = jiraUrl + '/rest/' + request

const method = nconf.get('method')

const consumerKey = nconf.get('consumerKey')

const pemFile = path.resolve(__dirname, '../cfg/consumer.pem')
const privateKey = fs.existsSync(pemFile) ? fs.readFileSync(pemFile) : undefined

const [oauthToken, oauthTokenSecret] = [nconf.get('oauthToken'), nconf.get('oauthTokenSecret')]

const oauthHeader = getOAuth1Header(url, method, consumerKey, privateKey, oauthToken, oauthTokenSecret)
console.log('Authorization:' + oauthHeader)
