'use strict'

const { getEnvAuth } = require('./index')
const { jiraFetch } = require('./jirafetch')

const auth = getEnvAuth()

async function myself () {
  try {
    const myself = await jiraFetch(auth).then((json) => { return json.name })
    return myself
  } catch (err) {
    console.error('ERROR> Failed to log into JIRA with the given credentials:', err.message)
    console.log('Make sure you provided a correct and exported `pw` environment variable.')
  }
}

async function searchIssues () {
  const jql = 'jql=key%20in%20(SPLPRJ-42%2CSPLPRJ-43%2CSPLPRJ-44)%20ORDER%20BY%20key%20ASC'
  const issues = await jiraFetch(auth, 'GET', `api/2/search?${jql}`).then((json) => { return json.issues })
  return issues
}

async function getIssue (key) {
  const issue = await jiraFetch(auth, 'GET', `api/2/issue/${key}`)
  return issue
}

async function getComment (key, id) {
  const comment = await jiraFetch(auth, 'GET', `api/2/issue/${key}/comment/${id}`)
  return comment
}

async function putComment (key, id, body) {
  const comment = await jiraFetch(auth, 'PUT', `api/2/issue/${key}/comment/${id}`, body)
  return comment
}

async function postComment (key, body) {
  const comment = await jiraFetch(auth, 'POST', `api/2/issue/${key}/comment`, body)
  return comment
}

async function deleteComment (key, id) {
  const comment = await jiraFetch(auth, 'DELETE', `api/2/issue/${key}/comment/${id}`)
  return comment
}

module.exports = { myself, searchIssues, getIssue, getComment, putComment, postComment, deleteComment }
