'use strict'
/* globals fetch */

async function getEnvAuth () {
  console.log('Running under node.js')
  const [vone, credentials, agent] = [
    'https://safeuat.hq.k.grp/Safeuat', undefined, undefined
  ]
  return {getFetch, vone, credentials, agent}
}

function getFetch () {
  return fetch
}

module.exports = { getEnvAuth }
