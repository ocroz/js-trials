'use strict'

const https = require('https')
const fetch = require('node-fetch')

const baseUrl = 'https://atlassian.hq.k.grp/confluence'
const DELIM = ';'

const [user, pass] = [process.env['USERNAME'], process.env['pw']] // you should export pw
if (pass === undefined) { console.error('ERROR> you should export pw prior running this script !!!') }
const agent = new https.Agent({ rejectUnauthorized: false }) // insecure
const Authorization = 'Basic ' + Buffer.from(user + ':' + pass, 'binary').toString('base64')
const headers = { Authorization, 'Accept': 'application/json', 'Content-Type': 'application/json' }

getRestrictedPages()
async function getRestrictedPages () {
  const spaces = await fetchUrl('/rest/api/space?type=global&status=CURRENT&limit=200')
  if (spaces.size === spaces.limit) { console.log('ERROR> size equals limit, you should increase limit !!!') }

  for (let space of spaces.results) {
    const pages = await fetchUrl('/rpc/json-rpc/confluenceservice-v2/getPages', 'POST', [space.key])

    for (let page of pages) {
      const pagePermissions = await fetchUrl('/rpc/json-rpc/confluenceservice-v2/getContentPermissionSets', 'POST', [page.id])

      for (let pagePermission of pagePermissions) {
        for (let contentPermission of pagePermission.contentPermissions) {
          contentPermission.groupName && console.log([space.key, page.id, contentPermission.type, contentPermission.groupName].join(DELIM))
        }
      }
    }
  }
}

async function fetchUrl (path, method = 'GET', body) {
  return new Promise((resolve, reject) => {
    fetch(baseUrl + path, {agent, headers, method, body: body && JSON.stringify(body)})
    .catch(err => console.error(err))
    .then(resp => {
      const { ok, status, statusText } = resp
      if (resp.status === 204) { resolve({ ok, status, statusText }); return } // no content
      if (resp.headers.get('Content-Type').search(/application.json/i) >= 0) { // json or text
        resp.json().then(data => ok ? resolve(data) : reject(new Error(JSON.stringify(data))))
      } else {
        resp.text().then(data => ok ? resolve(data) : reject(new Error(data)))
      }
    })
  })
}
