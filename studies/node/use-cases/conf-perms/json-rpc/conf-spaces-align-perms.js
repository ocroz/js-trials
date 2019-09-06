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
  const spaces = await fetchUrl('/rest/api/space?type=global&status=CURRENT&limit=200')
  if (spaces.size === spaces.limit) { console.log('ERROR> size equals limit, you should increase limit !!!') }

  for (let space of spaces.results) {
    const addedMembers = {}
    const spaceGroups = {
      readers: `${STANDARDPREFIX}-${space.key.toLowerCase()}-r`,
      contribs: `${STANDARDPREFIX}-${space.key.toLowerCase()}-rw`,
      admins: `${STANDARDPREFIX}-${space.key.toLowerCase()}-a`
    }
    const addedGroupMembers = { [spaceGroups.readers]: [], [spaceGroups.contribs]: [], [spaceGroups.admins]: [] }
    // console.log(`Looping through space ${space.key} ...`)
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

    // Group extra members per target groups
    for (let member of Object.keys(addedMembers)) {
      // const spaceGroup =
      //   addedMembers[member].SETSPACEPERMISSIONS ? spaceGroups.admins
      //   : addedMembers[member].EDITSPACE ? spaceGroups.contribs
      //   : spaceGroups.readers
      // console.log(`${member};${Object.keys(addedMembers[member])};${spaceGroup}`)

      if (addedMembers[member].SETSPACEPERMISSIONS) { // space admin permission
        addedGroupMembers[spaceGroups.admins].push(member)
      } else if (addedMembers[member].EDITSPACE) { // permission to add page in space
        addedGroupMembers[spaceGroups.contribs].push(member)
      } else {
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
