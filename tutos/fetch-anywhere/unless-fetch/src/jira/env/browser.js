'use strict'

/* global fetch */

const { trycatch } = require('../../common/lib/trycatch')
const { nonVoids } = require('../../common/lib/utils')
const { fetchJira } = require('../lib/anywhere-fetch')
const { jqueryJira } = require('../lib/browser-jquery')
const { webixJira } = require('../lib/browser-webix')
const { xhrJira } = require('../lib/browser-xhr')
// const { getOAuth1Header } = require('../lib/oauth1-for-node')

const jiraConfig = require('../cfg/jira-config.json')

console.log('Running under browser')

// const story = 0 // 0=errors.js, 1=issue.js
// const altFetchCase = 0 // 0=fetch, 1=jquery, 2=xhr, 3=webix
const [ story, altFetchCase, jiraUrl ] = [ // browserify uses envify for process.env
  Number(process.env.story) || jiraConfig.story,
  Number(process.env.altFetchCase) || jiraConfig.altFetchCase,
  process.env.jiraUrl || jiraConfig.jiraUrl
]
console.log({story, altFetchCase, jiraUrl})

// const [authMethod, basicCredentials, cookie] = [
//   process.env.authMethod || jiraConfig.authMethod,
//   process.env.basicCredentials || jiraConfig.basicCredentials,
//   process.env.cookie || jiraConfig.cookie
// ]
// const [consumerKey, privateKey, oauthToken, oauthTokenSecret] = [
//   process.env.consumerKey || jiraConfig.consumerKey,
//   process.env.privateKey || jiraConfig.privateKey,
//   process.env.oauthToken || jiraConfig.oauthToken,
//   process.env.oauthTokenSecret || jiraConfig.oauthTokenSecret
// ]
// const credentials = nonVoids({authMethod, basicCredentials, cookie, consumerKey, oauthToken, oauthTokenSecret})
// credentials.privateKey = privateKey && '...'
// console.log(credentials)

function getJiraConfig () {
  return {getFetch, jiraUrl, getAuthHeader, nonVoids}
}

function getFetch () {
  return fetch
}

function getAuthHeader (url, method) {
  // Only the Cookie authentication works in the browser
  // Because the header 'Authorization' is not allowed

  // switch (authMethod) {
  //   case 'Basic':
  //     console.log('Using Basic authentication...')
  //     return { name: 'Authorization', data: basicCredentials }
  //   case 'OAuth1':
  //     console.log('Using OAuth1 authentication...')
  //     const oauth1Header = getOAuth1Header(url, method, consumerKey, privateKey, oauthToken, oauthTokenSecret)
  //     return { name: 'Authorization', data: oauth1Header }
  //   case 'Cookie':
  //     console.log('Using Cookie authentication...')
  //     return { name: 'Cookie', data: cookie }
  //   default:
  //     console.log('Using browser Cookie authentication...')
  //     return undefined
  // }

  return undefined
}

function contactJira (...args) {
  switch (altFetchCase) {
    case 1:
      console.log('Contacting JIRA via jqueryJira()...')
      return jqueryJira(...args)
    case 2:
      console.log('Contacting JIRA via xhrJira()...')
      return xhrJira(...args)
    case 3:
      console.log('Contacting JIRA via webixJira()...')
      return webixJira(...args)
    case 0:
    default:
      console.log('Contacting JIRA via fetchJira()...')
      return fetchJira(...args)
  }
}

module.exports = { story, getJiraConfig, contactJira, trycatch }
