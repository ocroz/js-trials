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

async function request (method, request, body) {
  const json = await jiraFetch(auth, method, request, body)
  return json
}

module.exports = { myself, request }
