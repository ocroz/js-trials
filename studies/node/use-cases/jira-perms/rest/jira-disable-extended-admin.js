'use strict'

const https = require('https')
const fetch = require('node-fetch')

const baseUrl = 'https://atlassian-test.hq.k.grp/jira'

const [user, pass] = [process.env['USERNAME'], process.env['pw']] // you should export pw
if (pass === undefined) { console.error('ERROR> you should export pw prior running this script !!!') }
const agent = new https.Agent({ rejectUnauthorized: false }) // insecure
const Authorization = 'Basic ' + Buffer.from(user + ':' + pass, 'binary').toString('base64')
const Headers = { Authorization, 'Accept': 'application/json', 'Content-Type': 'application/json' }

disableProjectExtendedAdminFeature()
async function disableProjectExtendedAdminFeature () {
  const permissionSchemes = await fetchUrl('/rest/api/2/permissionscheme')

  for (let permissionScheme of permissionSchemes.permissionSchemes) {
    // if (permissionScheme.id !== 12341) continue // For testing

    console.log(`Disabling "project extended admin" feature on permission scheme ${permissionScheme.id} ...`)
    await fetchUrl(`/rest/api/2/permissionscheme/${permissionScheme.id}/attribute/ADMINISTER_PROJECTS.extended.enabled`, 'PUT', false, { Authorization })
  }
}

async function fetchUrl (path, method = 'GET', body, headers = Headers) {
  return new Promise((resolve, reject) => {
    fetch(baseUrl + path, {agent, headers, method, body: body && JSON.stringify(body)})
    .catch(err => console.error(err))
    .then(resp => {
      const { ok, status, statusText } = resp
      if (resp.status === 204) { resolve({ ok, status, statusText }); return } // no content
      if (resp.headers.get('Content-Type').search(/application.json/i) >= 0) { // json or text
        resp.json().then(data => ok ? resolve(data) : reject(new Error(JSON.stringify(data))))
      } else {
        resp.text().then(data => ok ? resolve(data) : reject(new Error(JSON.stringify({ ok, status, statusText, data }))))
      }
    })
  })
}
