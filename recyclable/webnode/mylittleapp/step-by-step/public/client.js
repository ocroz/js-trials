'use strict'
/* global $ fetch */

async function fetchJson (url = 'http://localhost:4000/json', method = 'GET', input) {
  console.log('BEGINNING OF REST CALL')
  const body = input !== undefined ? JSON.stringify(input) : undefined
  const headers = { 'Content-Type': 'application/json' }
  const agent = undefined
  return new Promise((resolve, reject) => {
    fetch(url, {
      method,
      body,
      headers,
      mode: 'cors',
      credentials: 'include',
      agent
    })
    .then((resp) => {
      const { ok, status, statusText } = resp
      const response = { ok, status, statusText }
      if (!resp.ok) {
        reject(new Error(JSON.stringify(response)))
      } else {
        if (resp.status === 204) { // means statusText === 'No Content'
          resolve(response)
        } else {
          resp.json().then((json) => { resolve(json) })
        }
      }
    })
    .catch((err) => { reject(err) })
    .then(() => {
      console.log('END OF REST CALL')
    })
  })
}

async function getJson () {
  const json = await fetchJson()
  console.log(json)
}

$(getJson())
