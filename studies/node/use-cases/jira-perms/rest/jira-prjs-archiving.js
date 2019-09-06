'use strict'

const https = require('https')
const fetch = require('node-fetch')

const baseUrl = 'https://atlassian.hq.k.grp/jira'

const [ARCHIVEBEFORE, REPORTONLY, DELIM] = [2018, false, ';']
const ARCHIVEIDS = [14540, 14140, 13641, 12239] // Archived projects are assigned to first value

const [user, pass] = [process.env['USERNAME'], process.env['pw']] // you should export pw
if (pass === undefined) { console.error('ERROR> you should export pw prior running this script !!!') }
const agent = new https.Agent({ rejectUnauthorized: false }) // insecure
const Authorization = 'Basic ' + Buffer.from(user + ':' + pass, 'binary').toString('base64')
const headers = { Authorization, 'Accept': 'application/json', 'Content-Type': 'application/json' }

getLastUpdated()
async function getLastUpdated () {
  const projects = await fetchUrl('/rest/api/2/project')
  for (let project of projects) {
    const issues = await fetchUrl(`/rest/api/2/search?jql=project=${project.key} ORDER BY updated DESC&maxResults=1`)
    if (REPORTONLY) {
      console.log(`${project.key}${DELIM}${issues.issues.length ? issues.issues[0].fields.updated.replace(/T.*/, '') : ''}`)
    } else {
      const lastUpdated = issues.issues.length ? issues.issues[0].fields.updated.replace(/-.*/, '') : 2009 // Earlier than ARCHIVEBEFORE
      if (lastUpdated < ARCHIVEBEFORE) { // Archive the project...
        const permissionScheme = await fetchUrl(`/rest/api/2/project/${project.key}/permissionscheme`)
        if (!ARCHIVEIDS.find(id => id === permissionScheme.id)) { // ...unless already archived
          console.log(`Switching project ${project.key} to permissionScheme ${ARCHIVEIDS[0]} ...`)
          await fetchUrl(`/rest/api/2/project/${project.key}/permissionscheme`, 'PUT', { 'id': ARCHIVEIDS[0] }) // First value
          // break // For testing
        }
      }
    }
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
