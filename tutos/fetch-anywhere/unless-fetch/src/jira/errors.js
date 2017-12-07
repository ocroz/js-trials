'use strict'

const { getEnvAuth, contactJira, trycatch } = require('./env/index')

// Errors from fetch()
// Errors without a response json
// Errors with an errorMessages[] array in the response json
// Errors with an errors{} object in the response json

const auth = getEnvAuth()
let priorities, myself

async function connect () {
  priorities = await contactJira(auth, 'GET', 'api/2/priority').then((json) => { return json.map(o => o.name) })
  console.log('JIRA priorities are:', priorities)

  const { name } = await contactJira(auth)
  myself = name
  console.log('I am', myself)

  errors()
}

async function error1 () {
  let myauth = getEnvAuth()
  myauth.jira = 'http://atlassian-fake.com/jira' // bad url
  myauth.agent = undefined

  const { name: myself } = await contactJira(myauth)
  console.log('I am', myself)
}

async function error2 () {
  let myauth = getEnvAuth()
  myauth.jira = 'https://atlassian-test.hq.k.grp/jira' // this url must be valid
  myauth.agent = undefined // missing agent for https (or extra agent for http)

  const { name: myself } = await contactJira(myauth)
  console.log('I am', myself)
}

async function error3 () {
  let myauth = getEnvAuth()
  myauth.credentials = 'undefined' // bad credentials

  const { name: myself } = await contactJira(myauth)
  console.log('I am', myself)
}

async function error4 () {
  const { key: projectkey } = await contactJira(auth, 'GET', 'api/2/_project_') // bad api
  console.log('queried project:', projectkey, auth.jira + '/projects/' + projectkey)
}

async function error5 () {
  const { key: projectkey } = await contactJira(auth, 'GET', 'api/2/project/_WEIRD_') // bad project key
  console.log('queried project:', projectkey, auth.jira + '/projects/' + projectkey)
}

async function error6 () {
  const { key: issuekey } = await contactJira(auth, 'GET', 'api/2/issue/_WEIRD-0_') // bad issue key
  console.log('queried issue:', issuekey, auth.jira + '/browse/' + issuekey)
}

async function error7 () {
  const { key: issuekey } = await contactJira(auth, 'POST', 'api/2/issue', {
    'fields': {
      // 'project': {'key': 'SPLPRJ'}, // no project
      'assignee': {'name': myself},
      'issuetype': {'name': 'Task'},
      'priority': {'name': priorities[1]},
      'summary': 'Submit issue through fetch',
      'description': ''
    }
  })
  console.log('submitted issue:', issuekey, auth.jira + '/browse/' + issuekey)
}

async function error8 () {
  const { key: issuekey } = await contactJira(auth, 'POST', 'api/2/issue', {
    'fields': {
      'project': {'key': 'SPLPRJ'},
      'assignee': {'name': myself},
      // 'issuetype': {'name': 'Task'}, // no issue type
      'priority': {'name': priorities[1]},
      'summary': 'Submit issue through fetch',
      'description': ''
    }
  })
  console.log('submitted issue:', issuekey, auth.jira + '/browse/' + issuekey)
}

async function error9 () {
  const { key: issuekey } = await contactJira(auth, 'POST', 'api/2/issue', {
    'fields': {
      'project': {'key': 'SPLPRJ'},
      'assignee': {'name': myself},
      'issuetype': {'name': 'Task'},
      'priority': {'name': priorities[1]},
      // 'summary': 'Submit issue through fetch', // no summary
      'description': ''
    }
  })
  console.log('submitted issue:', issuekey, auth.jira + '/browse/' + issuekey)
}

async function error10 () {
  const { key: issuekey } = await contactJira(auth, 'POST', 'api/2/issue', {
    'fields': {
      'project': {'key': 'SPLPRJ'},
      'assignee': {'name': myself},
      'issuetype': {'name': 'Task'},
      'priority': {'name': '_Blocker_'}, // bad priority
      'summary': 'Submit issue through fetch',
      'description': ''
    }
  })
  console.log('submitted issue:', issuekey, auth.jira + '/browse/' + issuekey)
}

async function error11 () {
  const { key: issuekey } = await contactJira(auth, 'POST', 'api/2/issue', {
    'fields': {
      'project': {'key': 'SPLPRJ'},
      'assignee': {'name': '_myself_'}, // bad assignee
      'issuetype': {'name': 'Task'},
      'priority': {'name': priorities[1]},
      'summary': 'Submit issue through fetch',
      'description': ''
    }
  })
  console.log('submitted issue:', issuekey, auth.jira + '/browse/' + issuekey)
}

async function error12 () {
  const { key: issuekey } = await contactJira(auth, 'POST', 'api/2/issue', {
    'fields': {
      'project': {'key': 'SPLPRJ'},
      '_project_': {'key': 'SPLPRJ'}, // bad attribute key
      'assignee': {'name': myself},
      'issuetype': {'name': 'Task'},
      'priority': {'name': priorities[1]},
      'summary': 'Submit issue through fetch',
      'description': ''
    }
  })
  console.log('submitted issue:', issuekey, auth.jira + '/browse/' + issuekey)
}

async function error13 () {
  const { key: issuekey } = await contactJira(auth, 'POST', 'api/2/issue', {
    'fields': {
      'project': {'key': 'SPLPRJ'},
      'assignee': {'name': myself},
      'issuetype': {'name': 'Task'},
      'priority': priorities[1], // bad attribute value
      'summary': 'Submit issue through fetch',
      'description': ''
    }
  })
  console.log('submitted issue:', issuekey, auth.jira + '/browse/' + issuekey)
}

async function error14 () {
  const { key: issuekey } = await contactJira(auth, 'POST', 'api/2/issue', {
    'fields': {
      'label': {'_key_': 'weird'}, // bad attribute value
      'project': {'key': 'SPLPRJ'},
      'assignee': {'name': myself},
      'issuetype': {'name': 'Task'},
      'priority': {'name': priorities[1]},
      'summary': 'Submit issue through fetch',
      'description': ''
    }
  })
  console.log('submitted issue:', issuekey, auth.jira + '/browse/' + issuekey)
}

async function error15 () {
  const { key: issuekey } = await contactJira(auth, 'POST', 'api/2/issue', {
    'fields': {
      'version': {'_key_': 'weird'}, // bad attribute value
      'project': {'key': 'SPLPRJ'},
      'assignee': {'name': myself},
      'issuetype': {'name': 'Task'},
      'priority': {'name': priorities[1]},
      'summary': 'Submit issue through fetch',
      'description': ''
    }
  })
  console.log('submitted issue:', issuekey, auth.jira + '/browse/' + issuekey)
}

trycatch(connect)

function errors () {
  trycatch(error1)
  trycatch(error2)
  trycatch(error3)
  trycatch(error4)
  trycatch(error5)
  trycatch(error6)
  trycatch(error7)
  trycatch(error8)
  trycatch(error9)
  trycatch(error10)
  trycatch(error11)
  trycatch(error12)
  trycatch(error13)
  trycatch(error14)
  trycatch(error15)
}
