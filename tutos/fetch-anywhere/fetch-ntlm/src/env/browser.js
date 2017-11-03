'use strict'
/* globals fetch */

async function getEnvAuth () {
  console.log('Running under browser')
  const [vone, credentials, agent] = [
    'https://safetest.hq.k.grp/Safetest', undefined, undefined
  ]
  return {getFetch, vone, credentials, agent}
}

function getFetch () {
  return fetch
}

module.exports = { getEnvAuth }
