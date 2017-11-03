'use strict'
// https://gist.github.com/JoeStanton/64697ebcd865d6d1145d020475d7a0f4
// https://github.com/SamDecrock/node-http-ntlm

const fetch = require('node-fetch')
const http = require('http')
const https = require('https')
const { ntlm } = require('httpntlm')
const { kgcerts } = require('../lib/kgcerts')

async function getEnvAuth (url) {
  console.log('Running under node.js')
  const [vone, username, password, domain, workstation] = [
    url || process.argv[2] || 'https://safetest.hq.k.grp/Safetest',
    process.argv[3] || process.env.USERNAME || '',
    process.argv[4] || process.env.pw || '',
    process.argv[3] || process.env.USERDOMAIN || '',
    '' // 'none'
  ]
  const agent = getAgent(vone, kgcerts)
  const authOpts = { username, password, domain, workstation }
  const credentials = await handshake(vone, authOpts, agent)
  return {getFetch, vone, credentials, agent}
}

function getFetch () {
  return fetch
}

function getAgent (url, ca) {
  return !url.match(/^https:/)
    ? new http.Agent({ keepAlive: true }) // http agent
    : ca === undefined
    ? new https.Agent({ keepAlive: true, rejectUnauthorized: false })
    : new https.Agent({ keepAlive: true, rejectUnauthorized: true, ca })
}

async function handshake (url, authOpts, agent) {
  console.log('BEGINNING OF NTLM CALL')
  return new Promise((resolve, reject) => {
    fetch(url, {
      headers: {
        Connection: 'keep-alive',
        Authorization: ntlm.createType1Message(authOpts)
      },
      agent
    })
    .then(resp => {
      const { ok, status, statusText } = resp
      const response = { ok, status, statusText }
      if (!resp.ok && resp.status !== 401) {
        reject(new Error(JSON.stringify(response)))
      }

      const type1 = resp.headers.get('www-authenticate')
      if (!type1) {
        reject(new Error('Stage 1 NTLM handshake failed.'))
      }

      const type2 = ntlm.parseType2Message(type1)
      const type3 = ntlm.createType3Message(type2, authOpts)
      resolve(type3)
    })
    .catch(err => reject(err))
    .then(() => {
      console.log('END OF NTLM CALL')
    })
  })
}

module.exports = { getEnvAuth }
