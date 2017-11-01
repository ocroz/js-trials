// browser.js
// https://nolanlawson.com/2017/01/09/how-to-write-a-javascript-package-for-both-node-and-the-browser/
'use strict'

/* global fetch */

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

// /* global btoa */
// function base64Encode (string) {
//   return btoa(string)
// }

// function getAgent (ca) {
//   return undefined
// }

module.exports = { getEnvAuth }
