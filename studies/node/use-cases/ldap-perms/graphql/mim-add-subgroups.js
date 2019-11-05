'use strict'

const fs = require('fs')
const https = require('https')
const fetch = require('node-fetch')

const baseUrl = 'https://qtwebservice-02.hq.k.grp:8101'

const EOL = '\n' // Or '\r\n'
const DELIM = ';'

const [user, pass] = [process.env['USERNAME'], process.env['pw']] // you should export pw
if (pass === undefined) { console.error('ERROR> you should export pw prior running this script !!!') }
const agent = new https.Agent({ rejectUnauthorized: false }) // insecure
const Authorization = 'Basic ' + Buffer.from(user + ':' + pass, 'binary').toString('base64')
const headers = { Authorization, 'Accept': 'application/json', 'Content-Type': 'application/json' }

addSubgroups()
async function addSubgroups () {
  // Login first
  const token = await fetchUrl('/login')
  headers.Authorization = `Bearer ${token.trim()}`

  //
  // cat ldap-get-subgroups-jira.log | while read l;do g=$(echo $l | sed 's,;.*,,g' | sed 's,^app-,svc-,g'); sg=$(echo $l | sed 's,.*;,,g' | \
  // sed 's,jira-users,svc-jira-users,g' | sed 's,atlassian-users,svc-jira-users,g' | sed 's,atlassian-administrators,svc-atl-admins,g' \
  // ); echo "$g;$sg"; done > mimAddSubgroups.txt
  //
  // cat ldap-get-subgroups-conf.log | while read l;do g=$(echo $l | sed 's,;.*,,g' | sed 's,^app-,svc-,g'); sg=$(echo $l | sed 's,.*;,,g' | \
  // sed 's,confluence-users,svc-confluence-users,g' | sed 's,atlassian-users,svc-confluence-users,g' | sed 's,atlassian-administrators,svc-atl-admins,g' \
  // ); echo "$g;$sg"; done > mimAddSubgroups.txt
  //
  // grep -v ';svc-' mimAddSubgroups.txt
  //
  const lines = fs.readFileSync('./mimAddSubgroups.txt', 'utf-8').split(EOL).filter(Boolean)

  for (let line of lines) {
    const [group, subgroup] = line.split(DELIM)
    console.log(`Adding ${subgroup} into ${group} ...`)

    const operation = 'addGroupName2Group' // returns true (success) or false (failure)
    await fetchGraphql('/graphql', 'POST', `mutation{${operation}(appName:"addSubgroups",groupName:"${group}",childGroupName:"${subgroup}")}`)
    .then(res => res.data && !res.data[operation] && new Promise((resolve, reject) => reject(new Error(`Failed to add ${subgroup} into ${group}.`))))

    // break // For testing
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
