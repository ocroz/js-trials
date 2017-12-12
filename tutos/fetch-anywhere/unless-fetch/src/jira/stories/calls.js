'use strict'

const { getEnvAuth, contactJira, trycatch } = require('../env/index')

// https://atlassian-test.hq.k.grp/jira/plugins/servlet/restbrowser
// GET priorities (OK as anonymous, as long as no credentials is passed)
// GET myself (must be logged in)
// POST new issue
// POST new comment
// GET new comment
// PUT update to comment
// GET updated comment
// DELETE comment

async function calls () {
  'use strict'
  const auth = getEnvAuth()

  const priorities = await contactJira(auth, 'GET', 'api/2/priority').then((json) => { return json.map(o => o.name) })
  console.log('JIRA priorities are:', priorities)

  const { name: myself } = await contactJira(auth)
  console.log('I am', myself)

  const { key: issuekey } = await contactJira(auth, 'POST', 'api/2/issue', {
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
  console.log('submitted issue:', issuekey, auth.jira + '/browse/' + issuekey)

  const { id: commentid } = await contactJira(auth, 'POST', 'api/2/issue/' + issuekey + '/comment', {
    'body': 'nice comment submitted through fetch'
  })
  console.log('submitted comment:', commentid)

  const { id: cid, body: cbody } = await contactJira(auth, 'GET', 'api/2/issue/' + issuekey + '/comment/' + commentid)
  console.log('comment is:', cid, cbody)

  const { id: pid, body: pbody } = await contactJira(auth, 'PUT', 'api/2/issue/' + issuekey + '/comment/' + commentid, {
    'body': 'nice comment updated through fetch'
  })
  console.log('comment is:', pid, pbody)

  const { id: uid, body: ubody } = await contactJira(auth, 'GET', 'api/2/issue/' + issuekey + '/comment/' + commentid)
  console.log('comment is:', uid, ubody)

  const res = await contactJira(auth, 'DELETE', 'api/2/issue/' + issuekey + '/comment/' + commentid)
  console.log('comment deleted with status:', res)
}

function main () {
  trycatch(calls)
}

module.exports = { main }
