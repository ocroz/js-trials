'use strict'

const https = require('https')
const fetch = require('node-fetch')

const baseUrl = 'https://atlassian.hq.k.grp/confluence'

const [SPACEKEY, PARENTPAGEID] = ['IBERICATT', 101684023]

const [user, pass] = [process.env['USERNAME'], process.env['pw']] // you should export pw
if (pass === undefined) { console.error('ERROR> you should export pw prior running this script !!!') }
const agent = new https.Agent({ rejectUnauthorized: false }) // insecure
const Authorization = 'Basic ' + Buffer.from(user + ':' + pass, 'binary').toString('base64')
const headers = { Authorization, 'Accept': 'application/json', 'Content-Type': 'application/json' }

clearChildrenPermissions()
async function clearChildrenPermissions () {
  const pages = await fetchUrl('/rpc/json-rpc/confluenceservice-v2/getPages', 'POST', [SPACEKEY])

  // let toBreak = false // For testing

  let parents = [PARENTPAGEID]
  for (let parent of parents) {
    for (let page of pages.filter(p => p.parentId === parent)) {
      console.log(parent + ' : ' + page.id)
      parents.push(page.id)

      for (let type of ['Edit', 'View']) {
        await fetchUrl('/rpc/json-rpc/confluenceservice-v2/setContentPermissions', 'POST', [page.id, type, []])
      }

      // toBreak = true; break // For testing
    }

    // if (toBreak) break // For testing
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
