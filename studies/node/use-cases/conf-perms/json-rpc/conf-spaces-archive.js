'use strict'

const fs = require('fs')
const https = require('https')
const fetch = require('node-fetch')

const baseUrl = 'https://atlassian.hq.k.grp/confluence'

const ADMINS = 'svc-atl-admins'
const MESSAGEFORDESCRIPTION = 'Archived in 2019 because unused'

const [user, pass] = [process.env['USERNAME'], process.env['pw']] // you should export pw
if (pass === undefined) { console.error('ERROR> you should export pw prior running this script !!!') }
const agent = new https.Agent({ rejectUnauthorized: false }) // insecure
const Authorization = 'Basic ' + Buffer.from(user + ':' + pass, 'binary').toString('base64')
const headers = { Authorization, 'Accept': 'application/json', 'Content-Type': 'application/json' }

archiveSpaces()
async function archiveSpaces () {
  const permissionLevels = await fetchUrl('/rpc/json-rpc/confluenceservice-v2/getSpaceLevelPermissions', 'POST')

  const spaceKeys = fs.readFileSync('./archivedSpaceKeys.txt', 'utf-8').split('\r\n').filter(Boolean)

  for (let spaceKey of spaceKeys) {
    // Get current permissions, then add ADMINS
    const spacePermissions = await fetchUrl('/rpc/json-rpc/confluenceservice-v2/getSpacePermissionSets', 'POST', [spaceKey])

    console.log('Adding all permissions for ' + ADMINS + ' to ' + spaceKey + ' ...')
    await fetchUrl('/rpc/json-rpc/confluenceservice-v2/addPermissionsToSpace', 'POST', [permissionLevels, ADMINS, spaceKey])
    .then(res => res === true || console.error(res.error.message))

    // Remove all current permissions
    for (let spacePermission of spacePermissions) {
      const permGrantedTo = spacePermission.spacePermissions.map(p => p.userName || p.groupName)
      for (let userOrGroup of permGrantedTo) {
        if (userOrGroup === null) { // Anonymous
          console.log('Removing anonymous permission ' + spacePermission.type + ' from ' + spaceKey + ' ...')
          await fetchUrl('/rpc/json-rpc/confluenceservice-v2/removeAnonymousPermissionFromSpace', 'POST', [spacePermission.type, spaceKey])
          .then(res => res === true || console.error(res.error.message))
        } else if (userOrGroup.localeCompare(ADMINS)) { // Unless ADMINS
          console.log('Removing permission ' + spacePermission.type + ' for ' + userOrGroup + ' from ' + spaceKey + ' ...')
          await fetchUrl('/rpc/json-rpc/confluenceservice-v2/removePermissionFromSpace', 'POST', [spacePermission.type, userOrGroup, spaceKey])
          .then(res => res === true || console.error(res.error.message))
        }
      }
    }

    // Prefix the space description with meaningful message
    const spaceDetails = await fetchUrl(`/rest/api/space/${spaceKey}?expand=description.plain`)
    const { name, description } = spaceDetails
    if (!description.plain.value.includes(MESSAGEFORDESCRIPTION)) { // Unless contains
      const spaceDescription = MESSAGEFORDESCRIPTION + '\n' + description.plain.value
      console.log(`Updating space ${spaceKey} with name "${name}" and description "${spaceDescription}" ...`)
      await fetchUrl(`/rest/api/space/${spaceKey}`, 'PUT', { name, description: { plain: { value: spaceDescription } } })
    }

    // Archive the space
    console.log('Archiving space ' + spaceKey + ' ...')
    await fetchUrl('/rpc/json-rpc/confluenceservice-v2/setSpaceStatus', 'POST', [spaceKey, 'ARCHIVED'])
    .then(res => res === true || console.error(res.error.message))

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
