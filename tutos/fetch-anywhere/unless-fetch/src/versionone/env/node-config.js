'use strict'

const fs = require('fs')
const path = require('path')
const nconf = require('nconf')
const { nonVoids } = require('../../common/utils')

// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at 'path/to/config.json'
const cfgFile = path.resolve(__dirname, '../cfg/vone-config.json')
nconf.argv().env().file({file: cfgFile})

// const story = 0 // 0=errors.js, 1=info.js
// const altFetchCase = 0 // 0=fetch, 1=httpntlm, 2=httpreq, 3=http, 4=https, 5=request
const [story, altFetchCase] = [Number(nconf.get('story')), Number(nconf.get('altFetchCase'))]

// const voneUrl
// const authMethod = 'Cookie', 'NTLM'
const [voneUrl, authMethod] = [nconf.get('voneUrl'), nconf.get('authMethod')]

// 'Cookie' data
const cookie = nconf.get('cookie')

// 'NTLM' data - default credentials in case no other auth method is provided
const [username, password] = [nconf.get('USERNAME'), nconf.get('pw')]
const [domain, workstation] = [nconf.get('USERDOMAIN'), '']

// 'OAuth2' data
const [oauthToken, urlFix] = [nconf.get('oauthToken'), nconf.get('urlFix')]

// Load ca.cer for https requests
const caFile = path.resolve(__dirname, '../cfg/ca.cer')
const ca = fs.existsSync(caFile) ? fs.readFileSync(caFile) : undefined

// Log voneConfig
const credentials = nonVoids({authMethod, domain, username, workstation, oauthToken, urlFix, cookie})
credentials.password = password && '...'
console.log({story, altFetchCase, voneUrl, credentials, ca: ca && '...'})

module.exports = { story, altFetchCase, voneUrl, authMethod, username, password, domain, workstation, oauthToken, urlFix, cookie, ca, nonVoids }
