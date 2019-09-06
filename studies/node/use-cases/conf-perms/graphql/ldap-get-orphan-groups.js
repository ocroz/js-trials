'use strict'

const https = require('https')
const fetch = require('node-fetch')

let baseUrl
const appUrls = ['https://atlassian.hq.k.grp/jira'] // ['https://atlassian.hq.k.grp/jira']
const ldapUrl = 'https://qtwebservice-01.hq.k.grp:8099'
const searchGroups = 'app-jira-*' // 'app-jira-*'

const [user, pass] = [process.env['USERNAME'], process.env['pw']] // you should export pw
if (pass === undefined) { console.error('ERROR> you should export pw prior running this script !!!') }
const agent = new https.Agent({ rejectUnauthorized: false }) // insecure
const Authorization = 'Basic ' + Buffer.from(user + ':' + pass, 'binary').toString('base64')
const headers = { Authorization, 'Accept': 'application/json', 'Content-Type': 'application/json' }

getOrphanGroups()
async function getOrphanGroups () {
  // Get all the current spaces // projects
  let lowerKeys = []
  for (baseUrl of appUrls) {
    // Either get Confluence space keys
    // const spaces = await fetchUrl('/rest/api/space?type=global&status=CURRENT&limit=500')
    // if (spaces.size === spaces.limit) { console.log('ERROR> size equals limit, you should increase limit !!!') }
    // const newKeys = spaces.results.map(s => s.key.toLowerCase()).filter(v => lowerKeys.indexOf(v) < 0)

    // Or get JIRA project keys
    const projects = await fetchUrl('/rest/api/2/project')
    const newKeys = projects.map(s => s.key.toLowerCase()).filter(v => lowerKeys.indexOf(v) < 0)

    lowerKeys = lowerKeys.concat(newKeys).sort()
  }

  // Login first
  baseUrl = ldapUrl
  const token = await fetchUrl('/login')
  headers.Authorization = `Bearer ${token.trim()}`

  // Query all the groups
  const groups = await fetchGraphql('/graphql', 'POST', `query{searchGroup(name:"${searchGroups}"){sAMAccountName}}`)

  // Get orphan groups
  const PREFIX = new RegExp('^' + searchGroups.replace('*', ''))
  const orphans =
    groups.data.searchGroup
    .filter(g => g.sAMAccountName.match(PREFIX))                                         // Keep only groups starting with PREFIX
    .filter(g => g.sAMAccountName.indexOf('-archived') < 0)                              // Keep only groups not archived already
    .map(g => g.sAMAccountName.replace(PREFIX, '').replace(/-[^-]*$/, '').toLowerCase()) // Get key part of the groups
    .filter((v, i, a) => a.indexOf(v) === i)                                             // Keep only unique values (after previous map)
    .filter(v => lowerKeys.indexOf(v) < 0)                                          // Keep only keys with no corresponding spaces
    .sort()
  orphans.forEach(e => console.log(e))

  // node ldap-get-orphan-groups.js | while read key; do adfind -b "OU=Atlassian_ESCAK,OU=Applications,OU=Administrative,DC=hq,DC=k,DC=grp" -f "(sAMAccountName=app-confluence-$key-*)" sAMAccountName -csv; done | grep archived
}

async function fetchGraphql (path, method, query, variables) {
  return fetchUrl(path, method, { query, variables })
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
