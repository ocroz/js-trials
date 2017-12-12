'use strict'

/* global fetch */

const { trycatch } = require('../../common/lib/trycatch')
const { fetchJira } = require('../lib/anywhere-fetch')
const { jqueryJira } = require('../lib/browser-jquery')
const { webixJira } = require('../lib/browser-webix')
const { xhrJira } = require('../lib/browser-xhr')

const jiraConfig = require('../cfg/jira-config.json')

console.log('Running under browser')

// const story = 0 // 0=calls.js, 1=errors.js
// const altFetchCase = 0 // 0=fetch, 1=jquery, 2=xhr, 3=webix
const [ story, altFetchCase, jiraUrl ] = [ // browserify uses envify for process.env
  Number(process.env.story) || jiraConfig.story,
  Number(process.env.altFetchCase) || jiraConfig.altFetchCase,
  process.env.jiraUrl || jiraConfig.jiraUrl
]
console.log({story, altFetchCase, jiraUrl})

function getEnvAuth () {
  return {getFetch, jira: jiraUrl}
}

function getFetch () {
  return fetch
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

module.exports = { story, getEnvAuth, contactJira, trycatch }
