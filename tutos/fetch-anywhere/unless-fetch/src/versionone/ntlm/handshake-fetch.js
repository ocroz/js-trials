'use strict'

const fetch = require('node-fetch')
const { ntlm } = require('httpntlm')

async function ntlmHandshake (url, authOpts, agent) {
  console.log('BEGINNING OF NTLM CALL')
  return new Promise((resolve, reject) => {
    const type1 = ntlm.createType1Message(authOpts)
    fetch(url, {
      headers: {
        Connection: 'keep-alive',
        Authorization: type1
      },
      agent
    })
    .then(resp => {
      const { ok, status, statusText } = resp
      const response = { ok, status, statusText }
      if (!resp.ok && resp.status !== 401) {
        reject(new Error(JSON.stringify(response)))
      }

      const auth1 = resp.headers.get('www-authenticate')
      if (!auth1) {
        reject(new Error('Stage 1 NTLM handshake failed.'))
      }

      const type2 = ntlm.parseType2Message(auth1)

      try { // This step fails if (authOpts.password === undefined)
        const type3 = ntlm.createType3Message(type2, authOpts)
        resolve(type3)
      } catch (err) { reject(new Error('[ntlm handshake type2 error] ' + err.message)) }
    })
    .catch(err => reject(err))
    .then(() => {
      console.log('END OF NTLM CALL')
    })
  })
}

module.exports = { ntlmHandshake }
