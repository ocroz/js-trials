'use strict'
/* global fetch */

async function fetchJson (url = 'http://localhost:4000/json', method = 'GET', input) {
  console.log('BEGINNING OF REST CALL')
  const body = input !== undefined ? JSON.stringify(input) : undefined
  const headers = { 'Content-Type': 'application/json' }
  const [mode, credentials, agent] = ['cors', 'include', undefined]
  return new Promise((resolve, reject) => {
    fetch(url, {method, body, headers, mode, credentials, agent})
    .then(resp => {
      resp.json().then(json => { resolve(json) })
    })
    .catch(err => { reject(err) })
    .then(() => {
      console.log('END OF REST CALL')
    })
  })
}

async function getJson (method, input) { // eslint-disable-line no-unused-vars
  const json = await fetchJson(undefined, method, input)
  console.log(json)
}
