'use strict'

const https = require('https')
const fetch = require('node-fetch')

const baseUrl = 'https://qtwebservice-01.hq.k.grp:8099'
const searchGroups = 'app-jira-*' // app-confluence-*
const DELIM = ';'

const [user, pass] = [process.env['USERNAME'], process.env['pw']] // you should export pw
if (pass === undefined) { console.error('ERROR> you should export pw prior running this script !!!') }
const agent = new https.Agent({ rejectUnauthorized: false }) // insecure
const Authorization = 'Basic ' + Buffer.from(user + ':' + pass, 'binary').toString('base64')
const headers = { Authorization, 'Accept': 'application/json', 'Content-Type': 'application/json' }

getSubgroups()
async function getSubgroups () {
  // Login first
  const token = await fetchUrl('/login')
  headers.Authorization = `Bearer ${token.trim()}`

  // Query all the groups
  const groups = await fetchGraphql('/graphql', 'POST', `query{searchGroup(name:"${searchGroups}"){sAMAccountName}}`)

  // Query and show groups with their subgroups
  for (let group of groups.data.searchGroup.filter(g => g.sAMAccountName.indexOf('-archived') < 0)) {
    // console.log(`Processing ${group.sAMAccountName} ...`)
    const subgroups = await fetchGraphql('/graphql', 'POST', `query{searchGroup(name:"${group.sAMAccountName}"){sAMAccountName,memberGroup{sAMAccountName}}}`)
    for (let subgroup of subgroups.data.searchGroup[0].memberGroup) {
      console.log(group.sAMAccountName + DELIM + subgroup.sAMAccountName)
    }
  }
}

async function fetchGraphql (path, method, query, operationName, variables) {
  return fetchUrl(path, method, { query, operationName, variables })
         .then(res => !res.errors ? res : new Promise((resolve, reject) => reject(new Error(JSON.stringify(res)))))
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
