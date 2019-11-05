'use strict'

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
  const spaces = await fetchUrl('/rest/api/space?type=global&status=CURRENT&limit=500')
  if (spaces.size === spaces.limit) { console.log('ERROR> size equals limit, you should increase limit !!!') }

  for (let space of spaces.results) {
    // if (space.key.localeCompare('SERVICESTRANS')) continue // For testing
    // console.log(`Looping through space ${space.key} ...`)

    const addedMembers = {}
    const spaceGroups = {
      readers: `${STANDARDPREFIX}-${space.key.toLowerCase()}-r`,
      contribs: `${STANDARDPREFIX}-${space.key.toLowerCase()}-rw`,
      admins: `${STANDARDPREFIX}-${space.key.toLowerCase()}-a`
    }
    const addedGroupMembers = { [spaceGroups.readers]: [], [spaceGroups.contribs]: [], [spaceGroups.admins]: [] }
    const spacePermissions = await fetchUrl('/rpc/json-rpc/confluenceservice-v2/getSpacePermissionSets', 'POST', [space.key])

    // Remove and List extra permissions
    for (let spacePermission of spacePermissions) {
      const permGrantedTo = spacePermission.spacePermissions.map(p => p.userName || p.groupName)
      for (let userOrGroup of permGrantedTo) {
        if (userOrGroup !== null) { // Anonymous
          if (
            userOrGroup.localeCompare(spaceGroups.readers) &&
            userOrGroup.localeCompare(spaceGroups.contribs) &&
            userOrGroup.localeCompare(spaceGroups.admins) &&
            userOrGroup.localeCompare(ADMINS)
          ) { // Unless ADMINS and standard space groups
            // Remove extra permissions
            // console.log('Removing permission ' + spacePermission.type + ' for ' + userOrGroup + ' from ' + space.key + ' ...')

            // List extra permissions
            addedMembers[userOrGroup] = { ...addedMembers[userOrGroup], ...{ [spacePermission.type]: true } }
          }
        }
      }
    }

    const spaceGroupReaders = await getGroupMembers(spaceGroups.readers)
    const spaceGroupContribs = await getGroupMembers(spaceGroups.contribs)
    const spaceGroupAdmins = await getGroupMembers(spaceGroups.admins)

    // Group extra members per target groups
    for (let member in addedMembers) {
      // const spaceGroup =
      //   addedMembers[member].SETSPACEPERMISSIONS ? spaceGroups.admins
      //   : addedMembers[member].EDITSPACE ? spaceGroups.contribs
      //   : spaceGroups.readers
      // console.log(`${member};${Object.keys(addedMembers[member])};${spaceGroup}`)

      if (addedMembers[member].SETSPACEPERMISSIONS) { // space admin permission
        await removeUserPermissionWhenInSpaceGroup(space.key, spaceGroupAdmins, member, Object.keys(addedMembers[member])) ||
        addedGroupMembers[spaceGroups.admins].push(member)
      } else if (addedMembers[member].EDITSPACE) { // permission to add page in space
        await removeUserPermissionWhenInSpaceGroup(space.key, spaceGroupContribs, member, Object.keys(addedMembers[member])) ||
        addedGroupMembers[spaceGroups.contribs].push(member)
      } else {
        await removeUserPermissionWhenInSpaceGroup(space.key, spaceGroupReaders, member, Object.keys(addedMembers[member])) ||
        addedGroupMembers[spaceGroups.readers].push(member)
      }
    }

    // List extra members per target groups
    for (let spaceGroup of Object.values(spaceGroups)) {
      if (addedGroupMembers[spaceGroup].length) {
        console.log(spaceGroup + ' : ' + addedGroupMembers[spaceGroup].join(';'))
      }
    }

    // break // For testing
  }
}

async function getGroupMembers (group) {
  const members = await fetchUrl(`/rest/api/group/${group}/member`)
  while (members._links.next) { // /rest/api/group/${group}/member?limit=200&start=200"
    // console.log(`Fetching ${members._links.next} ...`)
    const nextMembers = await fetchUrl(members._links.next)
    members.results.push(...nextMembers.results)
    members.size += nextMembers.size
    members._links.next = nextMembers._links.next
  }
  return members
}

async function removeUserPermissionWhenInSpaceGroup (spaceKey, spaceGroup, member, permissions) {
  spaceGroup.results.forEach(m => {
    if (!m.username) {
      console.log({spaceKey, spaceGroup, member, permissions})
      console.log(`ERROR> ${m} has no username ...`)
    }
  })
  if (spaceGroup.results.filter(m => !m.username.localeCompare(member)).length !== 1) return false
  for (let permission of permissions) {
    console.log('Removing permission ' + permission + ' for ' + member + ' from ' + spaceKey + ' ...')
    await fetchUrl('/rpc/json-rpc/confluenceservice-v2/removePermissionFromSpace', 'POST', [permission, member, spaceKey])
  }
  return true
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
