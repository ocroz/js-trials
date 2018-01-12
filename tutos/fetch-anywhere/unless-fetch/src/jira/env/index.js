'use strict'

const http = require('http')
const https = require('https')
const fetch = require('node-fetch')
const { trycatch } = require('../../common/trycatch')
const { fetchJira } = require('../lib/anywhere-fetch')
const { httpJira } = require('../lib/node-http')
const { httpsJira } = require('../lib/node-https')
const { requestJira } = require('../lib/node-request')
const { getOAuth1Header } = require('../oauth/oauth1-headers')

console.log('Running under node.js')

const jiraConfig = require('./node-config')

function getJiraConfig () {
  const { jiraUrl, nonVoids } = jiraConfig
  const agent = getAgent(jiraConfig.jiraUrl, jiraConfig.ca)
  return {jiraUrl, getFetch, getAuthHeader, agent, nonVoids}
}

function getFetch () {
  return fetch
}

function getAuthHeader (url, method) {
  switch (jiraConfig.authMethod) {
    case 'Cookie':
      console.log('Using Cookie authentication...')
      return { name: 'Cookie', data: jiraConfig.cookie }
    case 'OAuth1':
      console.log('Using OAuth1 authentication...')
      const {consumerKey, privateKey, oauthToken, oauthTokenSecret} = jiraConfig
      const oauth1Header = getOAuth1Header(url, method, consumerKey, privateKey, oauthToken, oauthTokenSecret)
      return { name: 'Authorization', data: oauth1Header }
    case 'Basic':
    default:
      console.log('Using Basic authentication...')
      return { name: 'Authorization', data: jiraConfig.basicCredentials }
  }
}

function getAgent (url, ca) {
  return !url.match(/^https:/)
    ? new http.Agent({ rejectUnauthorized: false }) // https.request() needs an agent, could be undefined for others
    : !ca
    ? new https.Agent({ rejectUnauthorized: false })
    : new https.Agent({ ca, rejectUnauthorized: true })
}

function contactJira (...args) {
  switch (jiraConfig.altFetchCase) {
    case 1:
      console.log('Contacting JIRA via httpJira()...')
      return httpJira(...args)
    case 2:
      console.log('Contacting JIRA via httpsJira()...')
      return httpsJira(...args)
    case 3:
      console.log('Contacting JIRA via requestJira()...')
      return requestJira(...args)
    case 0:
    default:
      console.log('Contacting JIRA via fetchJira()...')
      return fetchJira(...args)
  }
}

module.exports = { story: jiraConfig.story, getJiraConfig, contactJira, trycatch }
