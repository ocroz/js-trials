'use strict'

const fs = require('fs')
const https = require('https')
const fetch = require('node-fetch')

const baseUrl = 'https://atlassian.hq.k.grp/confluence'

const ADMINS = 'atlassian-administrators'
const STANDARDPREFIX = 'app-confluence'

const [user, pass] = [process.env['USERNAME'], process.env['pw']] // you should export pw
if (pass === undefined) { console.error('ERROR> you should export pw prior running this script !!!') }
const agent = new https.Agent({ rejectUnauthorized: false }) // insecure
const Authorization = 'Basic ' + Buffer.from(user + ':' + pass, 'binary').toString('base64')
const headers = { Authorization, 'Accept': 'application/json', 'Content-Type': 'application/json' }

alignPermsOnSpaces()
async function alignPermsOnSpaces () {
  const spaces = await fetchUrl('/rest/api/space?type=global&status=CURRENT&limit=200')
  if (spaces.size === spaces.limit) { console.log('ERROR> size equals limit, you should increase limit !!!') }

  for (let space of spaces.results) {
    console.log(`Looping through space ${space.key} ...`)
    const spacePermissions = await fetchUrl('/rpc/json-rpc/confluenceservice-v2/getSpacePermissionSets', 'POST', [space.key])

    for (let spacePermission of spacePermissions) {
      const permGrantedTo = spacePermission.spacePermissions.map(p => p.userName || p.groupName)
      for (let userOrGroup of permGrantedTo) {
        if (userOrGroup !== null) { // Anonymous
          if (
            userOrGroup.localeCompare(`${STANDARDPREFIX}-${space.key.toLowerCase()}-r`) &&
            userOrGroup.localeCompare(`${STANDARDPREFIX}-${space.key.toLowerCase()}-rw`) &&
            userOrGroup.localeCompare(`${STANDARDPREFIX}-${space.key.toLowerCase()}-a`) &&
            userOrGroup.localeCompare(ADMINS)
          ) { // Unless ADMINS and standard space groups
            console.log('Removing permission ' + spacePermission.type + ' for ' + userOrGroup + ' from ' + space.key + ' ...')
          }
        }
      }
    }

    // break // For testing
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
