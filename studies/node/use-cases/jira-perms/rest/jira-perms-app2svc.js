'use strict'

const https = require('https')
const fetch = require('node-fetch')

const baseUrl = 'https://atlassian-test.hq.k.grp/jira'

const [user, pass] = [process.env['USERNAME'], process.env['pw']] // you should export pw
if (pass === undefined) { console.error('ERROR> you should export pw prior running this script !!!') }
const agent = new https.Agent({ rejectUnauthorized: false }) // insecure
const Authorization = 'Basic ' + Buffer.from(user + ':' + pass, 'binary').toString('base64')
const headers = { Authorization, 'Accept': 'application/json', 'Content-Type': 'application/json' }

updatePermissions()
async function updatePermissions () {
  const permissionSchemes = await getPermissionSchemes()
  for (let permissionScheme of permissionSchemes.permissionSchemes) {
    // if (permissionScheme.id !== 12341) continue // For testing
    console.log(`Updating permission scheme ${permissionScheme.id} ...`)

    const permissions = await getPermissions(permissionScheme.id)
    for (let permission of permissions.permissions) {
      if (permission.holder.type === 'group' && permission.holder.parameter.startsWith('app-jira-')) {
        const group = permission.holder.parameter.replace(/^app-/, 'svc-')
        const groups = await getGroups(group)
        if (groups.groups.filter(g => !g.name.localeCompare(group)).length !== 1) {
          console.error(`ERROR> Scheme ${permissionScheme.name}: Group ${group} does not exist, skipping scheme...`); break
        }
        console.log(`Scheme ${permissionScheme.name}: Permission ${permission.permission}> Add ${group} ...`)
        await postPermission(permissionScheme.id, permission.permission, group)
        console.log(`Scheme ${permissionScheme.name}: Permission ${permission.permission}> Remove ${permission.holder.parameter} ...`)
        await deletePermission(permissionScheme.id, permission.id)

        // break // For testing
      }
    }
  }
}

async function getPermissionSchemes () { return fetchUrl('/rest/api/2/permissionscheme') }
async function getPermissions (schemeId) { return fetchUrl(`/rest/api/2/permissionscheme/${schemeId}?expand=permissions`) }
async function getGroups (query) { return fetchUrl(`/rest/api/2/groups/picker?query=${query}`) }
async function postPermission (schemeId, name, group) {
  const body = { 'permission': name, 'holder': { 'type': 'group', 'parameter': group } }
  return fetchUrl(`/rest/api/2/permissionscheme/${schemeId}/permission`, 'POST', body)
}
async function deletePermission (schemeId, id) { return fetchUrl(`/rest/api/2/permissionscheme/${schemeId}/permission/${id}`, 'DELETE') }

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
        resp.text().then(data => ok ? resolve(data) : reject(new Error(JSON.stringify({ ok, status, statusText, data }))))
      }
    })
  })
}
