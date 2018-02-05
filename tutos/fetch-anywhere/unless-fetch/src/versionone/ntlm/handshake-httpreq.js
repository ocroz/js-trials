'use strict'

var httpreq = require('httpreq')
const { ntlm } = require('httpntlm')

async function ntlmHandshake (url, authOpts, agent) {
  console.log('BEGINNING OF NTLM CALL')
  return new Promise((resolve, reject) => {
    const type1 = ntlm.createType1Message(authOpts)
    httpreq.get(url, {
      headers: {
        Connection: 'keep-alive',
        Authorization: type1
      },
      agent
    }, (err, resp) => {
      if (err) {
        reject(err)
      } else {
        const { statusCode, statusMessage } = resp
        const success = (statusCode >= 200 && statusCode < 300)
        const response = { success, statusCode, statusMessage }
        if (!success && statusCode !== 401) {
          reject(new Error(JSON.stringify(response)))
        }

        const auth1 = resp.headers['www-authenticate']
        if (!auth1) {
          reject(new Error('Stage 1 NTLM handshake failed.'))
        }

        const type2 = ntlm.parseType2Message(auth1)

        try { // This step fails if (authOpts.password === undefined)
          const type3 = ntlm.createType3Message(type2, authOpts)
          resolve(type3)
        } catch (err) { reject(new Error('[ntlm handshake type2 error] ' + err.message)) }
      }
      console.log('END OF NTLM CALL')
    })
  })
}

module.exports = { ntlmHandshake }
