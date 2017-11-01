'use strict'

async function voneFetch (auth = {}, method = 'GET', request = '', input) {
  // auth = {getFetch, vone, credentials, agent}
  if (auth.getFetch === undefined) { throw new Error('voneFetch: getFetch() is undefined') }
  if (auth.vone === undefined) { auth.vone = 'https://safetest.hq.k.grp/Safetest' }

  // fetch parameters
  const fetch = auth.getFetch()
  const url = auth.vone + '/' + request
  const body = input && JSON.stringify(input)
  const headers = auth.credentials
    ? { 'Accept': 'application/json', 'Content-Type': 'text/xml', 'Connection': 'keep-alive', 'Authorization': auth.credentials }
    : { 'Accept': 'application/json', 'Content-Type': 'text/xml' }
  const [mode, credentials, agent] = ['cors', 'include', auth.agent]
  // console.log(url, method, body, headers, mode, credentials, agent)

  // fetch promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    fetch(url, {method, body, headers, mode, credentials, agent})
    .then((resp) => {
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
        const myself = resp.headers.get('V1-MemberID')
        if (resp.status === 204) { // means statusText === 'No Content'
          resolve({myself, data: response})
        } else {
          // resp.json().then(json => { resolve(json) })
          // resp.text().then(text => { resolve(text) })
          resp.json()
          .catch(() => {
            if (resp._raw.length > 0) {
              const data = resp._raw.toString()
              resolve({myself, data})
            } else {
              resolve({myself, data: response})
            }
          }).then(data => { resolve({myself, data}) })
        }
      }
    })
    .catch(err => { reject(err) })
    .then(() => {
      console.log('END OF REST CALL')
    })
  })
}

module.exports = { voneFetch }
