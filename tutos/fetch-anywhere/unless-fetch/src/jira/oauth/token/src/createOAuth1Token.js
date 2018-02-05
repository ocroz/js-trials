'use strict'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const fs = require('fs')
const path = require('path')
const nconf = require('nconf')
const { createOAuth1Token } = require('./oauth1-dance.js')

const port = process.env.PORT || 1337

// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at 'path/to/config.json'
const cfgFile = path.resolve(__dirname, '../cfg/jira-config.json')
nconf.argv().env().file({file: cfgFile})

const jiraUrl = nconf.get('jiraUrl')

const consumerKey = nconf.get('consumerKey')

const pemFile = path.resolve(__dirname, '../cfg/consumer.pem')
const privateKey = fs.existsSync(pemFile) ? fs.readFileSync(pemFile) : undefined

createOAuth1Token(port, jiraUrl, consumerKey, privateKey)
