#!node
'use strict'

const fs = require('fs')
const https = require('https')
const fetch = require('node-fetch')

const jira = process.argv[2] || 'https://atlassian-test.hq.k.grp/jira'
const username = process.argv[3] || process.env.USERNAME
const password = process.argv[4] || process.env.pw

// https://atlassian-test.hq.k.grp/jira/plugins/servlet/restbrowser
// GET priorities (OK as anonymous, excepted if credentials are passed through the headers)
// GET myself (must be logged in)
// POST new issue
// POST new comment
// GET new comment
// PUT update to comment
// GET updated comment
// DELETE comment

async function main () {
  const priorities = await fetchJira(jira, 'GET', 'api/2/priority').then((json) => { return json.map(o => o.name) })
  console.log('JIRA priorities are:', priorities)

  const { name: myself } = await fetchJira(jira)
  console.log('I am', myself)

  const { key: issuekey } = await fetchJira(jira, 'POST', 'api/2/issue', {
    'fields': {
      'project': {'key': 'SPLPRJ'},
      'assignee': {'name': myself},
      'issuetype': {'name': 'Task'},
      'priority': {'name': priorities[1]},
      'summary': 'Submit issue through fetch',
      'description':
        '{panel:title=What would be the added value?|borderColor=#ccc| titleBGColor=#c2ffa2|bgColor=#fff}' +
        'fetch is available both at client and server sides' +
        '{panel}' +
        '{panel:title=Any details about the desired modification?|borderColor=#ccc| titleBGColor=#faacad|bgColor=#fff}' +
        'npm i node-fetch' +
        '{panel}'
    }
  })
  console.log('submitted issue:', issuekey, jira + '/browse/' + issuekey)

  const { id: commentid } = await fetchJira(jira, 'POST', 'api/2/issue/' + issuekey + '/comment', {
    'body': 'nice comment submitted through fetch'
  })
  console.log('submitted comment:', commentid)

  const { id: cid, body: cbody } = await fetchJira(jira, 'GET', 'api/2/issue/' + issuekey + '/comment/' + commentid)
  console.log('comment is:', cid, cbody)

  const { id: pid, body: pbody } = await fetchJira(jira, 'PUT', 'api/2/issue/' + issuekey + '/comment/' + commentid, {
    'body': 'nice comment updated through fetch'
  })
  console.log('comment is:', pid, pbody)

  const { id: uid, body: ubody } = await fetchJira(jira, 'GET', 'api/2/issue/' + issuekey + '/comment/' + commentid)
  console.log('comment is:', uid, ubody)

  const res = await fetchJira(jira, 'DELETE', 'api/2/issue/' + issuekey + '/comment/' + commentid)
  console.log('comment deleted with status:', res)
}

async function fetchJira (jira, method = 'GET', request = 'api/2/myself', input) {
  console.log('BEGINNING OF REST CALL')
  const url = jira + '/rest/' + request
  const body = input !== undefined ? JSON.stringify(input) : undefined
  return new Promise((resolve, reject) => {
    fetch(url, {
      method,
      body,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
      },
      agent: new https.Agent({
        // https://engineering.circle.com/https-authorized-certs-with-node-js-315e548354a2
        // For this certificate chain: Kudelski Group Root CA > Kudelski Group Issuing CA 01 > atlassian-test.hq.k.grp
        // The local certificate file should list the "Issuing CA" then the "Root CA" in base64 x509 format.
        ca: fs.readFileSync('./certs/KudelskiGroup-IssuingCA01-RootCA.crt'),
        rejectUnauthorized: true
      })
    })
    .then((resp) => {
      const response = {
        'ok': resp.ok,
        'status': resp.status,
        'statusText': resp.statusText
      }
      if (resp.ok) {
        switch (resp.statusText) {
          case 'No Content':
            resolve(response)
            break
          default:
            resp.json().then((json) => {
              resolve(json)
            })
            break
        }
      } else {
        reject(new Error(JSON.stringify(response)))
      }
    })
    .catch((err) => {
      reject(err)
    })
    .then(() => {
      console.log('END OF REST CALL')
    })
  })
}

async function trycatch () {
  try {
    await main()
    console.log('async processes succeeded, nothing more to do, leaving script')
  } catch (err) {
    console.error('async processes failed with error:', err.message)
  }
}

console.log('launching async processes')
trycatch()
console.log('async processes launched')
