'use strict'

/* global fetch */

const { trycatch } = require('../../common/lib/trycatch')
const { fetchJira } = require('../lib/anywhere-fetch')
const { jqueryJira } = require('../lib/browser-jquery')
const { xhrJira } = require('../lib/browser-xhr')

const altFetchCase = 0 // 0=fetch, 1=jquery, 2=xhr, 3=webix

function getEnvAuth () {
  console.log('Running under browser')
  const [jira, credentials, agent] = [
    'https://atlassian-test.hq.k.grp/jira', undefined, undefined
  ]
  return {getFetch, jira, credentials, agent}
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
    case 0:
    default:
      console.log('Contacting JIRA via fetchJira()...')
      return fetchJira(...args)
  }
}

module.exports = { getEnvAuth, contactJira, trycatch }
