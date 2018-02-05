'use strict'

async function _voneFetch (auth = {}, method = 'GET', request = 'rest-1.v1/Data/Scope/0', input) {
  // auth = {getFetch, vone, credentials, agent}
  if (auth.getFetch === undefined) { throw new Error('voneFetch: getFetch() is undefined') }
  if (auth.vone === undefined) { throw new Error('voneFetch: VersionOne URL is undefined') }

  // fetch parameters
  const fetch = auth.getFetch()
  const url = auth.vone + '/' + request
  const body = input && JSON.stringify(input)
  const headers = auth.credentials
    ? { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': auth.credentials }
    : { 'Accept': 'application/json', 'Content-Type': 'application/json' }
  const [mode, credentials, agent] = ['cors', 'include', auth.agent]
  // console.log(url, method, body, headers, mode, credentials, agent)

  // fetch promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    fetch(url, {method, body, headers, mode, credentials, agent})
    .then(resp => {
      const { ok, status, statusText } = resp
      const response = { ok, status, statusText }
      if (!resp.ok) {
        // The error could be embedded in a json response
        resp.json()
        .catch(() => reject(new Error(JSON.stringify(response)))) // The error is not embedded in a json response
        .then(json => { // Keep only the non-empty attributes from the json response
          const err = {}
          for (let attr in json) {
            if (Object.keys(json[attr]).length > 0) { // json[attr] is either array or object
              err[attr] = json[attr]
            }
          }
          reject(new Error(JSON.stringify(err)))
        })
      } else {
        const whoami = resp.headers.get('V1-MemberID')
        if (resp.status === 204) { // means statusText === 'No Content'
          resolve({whoami, data: response})
        } else {
          // resp.json().then(json => { resolve(json) })
          // resp.text().then(text => { resolve(text) })
          resp.json()
          .catch(() => {
            if (resp._raw.length > 0) {
              const data = resp._raw.toString()
              resolve({whoami, data})
            } else {
              resolve({whoami, data: response})
            }
          }).then(data => resolve({whoami, data}))
        }
      }
    })
    .catch(err => reject(err))
    .then(() => {
      console.log('END OF REST CALL')
    })
  })
}

async function getWhoAmI (auth, method, request, input) {
  return _voneFetch(auth, method, request, input).then(res => res.whoami)
}

async function voneFetch (auth, method, request, input) {
  return _voneFetch(auth, method, request, input).then(res => res.data)
}

module.exports = { voneFetch, getWhoAmI }
