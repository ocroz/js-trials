'use strict'

const https = require('https')
const fetch = require('node-fetch')

const baseUrl = 'https://atlassian-test.hq.k.grp/confluence'

const [ ADMINS_FROM, ADMINS_TO ] = [ 'atlassian-administrators', 'svc-atl-admins' ]
const [ PREFIX_FROM, PREFIX_TO ] = [ 'app-confluence', 'svc-confluence' ]

const [user, pass] = [process.env['USERNAME'], process.env['pw']] // you should export pw
if (pass === undefined) { console.error('ERROR> you should export pw prior running this script !!!') }
const agent = new https.Agent({ rejectUnauthorized: false }) // insecure
const Authorization = 'Basic ' + Buffer.from(user + ':' + pass, 'binary').toString('base64')
const headers = { Authorization, 'Accept': 'application/json', 'Content-Type': 'application/json' }

updatePermissions()
async function updatePermissions () {
  const spaces = await fetchUrl('/rest/api/space?type=global&status=CURRENT&limit=500')
  if (spaces.size === spaces.limit) { console.log('ERROR> size equals limit, you should increase limit !!!') }

  for (let space of spaces.results) {
    // if (space.key.localeCompare('cmadmin')) continue // For testing
    // console.log(`Looping through space ${space.key} ...`)

    // Add new permissions
    const readersPerms = ['VIEWSPACE', 'REMOVEOWNCONTENT', 'COMMENT']
    const contribsPerms = readersPerms.concat(['EDITSPACE', 'EDITBLOG', 'CREATEATTACHMENT', 'SETPAGEPERMISSIONS', 'EXPORTSPACE'])
    const adminsPerms = contribsPerms.concat(['REMOVEPAGE', 'REMOVEBLOG', 'REMOVEATTACHMENT', 'REMOVECOMMENT', 'REMOVEMAIL', 'SETSPACEPERMISSIONS'])
    await addPermissionsToSpace(readersPerms, `${PREFIX_TO}-${space.key.toLowerCase()}-r`, space.key)
    await addPermissionsToSpace(contribsPerms, `${PREFIX_TO}-${space.key.toLowerCase()}-rw`, space.key)
    await addPermissionsToSpace(adminsPerms, `${PREFIX_TO}-${space.key.toLowerCase()}-a`, space.key)
    await addPermissionsToSpace(adminsPerms, ADMINS_TO, space.key)

    // Remove old permissions
    const spacePermissions = await fetchUrl('/rpc/json-rpc/confluenceservice-v2/getSpacePermissionSets', 'POST', [space.key])
    for (let spacePermission of spacePermissions) {
      const permGrantedTo = spacePermission.spacePermissions.map(p => p.userName || p.groupName)
      for (let userOrGroup of permGrantedTo) {
        if (userOrGroup !== null) { // Anonymous
          if (
            !userOrGroup.localeCompare(`${PREFIX_FROM}-${space.key.toLowerCase()}-r`) ||
            !userOrGroup.localeCompare(`${PREFIX_FROM}-${space.key.toLowerCase()}-rw`) ||
            !userOrGroup.localeCompare(`${PREFIX_FROM}-${space.key.toLowerCase()}-a`) ||
            !userOrGroup.localeCompare(ADMINS_FROM)
          ) {
            await removePermissionFromSpace(spacePermission.type, userOrGroup, space.key)
          }
        }
      }
    }

    // break // For testing
  }
}

async function addPermissionsToSpace (permissions, userOrGroup, spaceKey) {
  console.log(`Adding permissions ${permissions} for ${userOrGroup} to space ${spaceKey} ...`)
  await fetchUrl('/rpc/json-rpc/confluenceservice-v2/addPermissionsToSpace', 'POST', [permissions, userOrGroup, spaceKey])
}

async function removePermissionFromSpace (permission, userOrGroup, spaceKey) {
  console.log(`Removing permission ${permission} for ${userOrGroup} from space ${spaceKey} ...`)
  await fetchUrl('/rpc/json-rpc/confluenceservice-v2/removePermissionFromSpace', 'POST', [permission, userOrGroup, spaceKey])
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
        resp.text().then(data => ok ? resolve(data) : reject(new Error(JSON.stringify({ ok, status, statusText, data }))))
      }
    })
  })
}
