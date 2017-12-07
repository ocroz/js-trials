'use strict'

/* globals $ */

async function jqueryJira (auth = {}, method = 'GET', request = 'api/2/myself', input) {
  // auth = {jira, credentials, agent}
  if (auth.jira === undefined) { auth.jira = 'https://atlassian-test.hq.k.grp/jira' }

  // jquery parameters
  const url = auth.jira + '/rest/' + request
  const type = method
  const data = input && JSON.stringify(input)
  const [dataType, crossDomain, contentType, async, xhrFields] =
    ['json', true, 'application/json', true, {withCredentials: true}]

  // jquery promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    function success (data, textStatus, result) {
      if (result.status === 204) { // means statusText === 'No Content'
        const { status, statusText } = result
        resolve({ textStatus, status, statusText })
      } else {
        resolve(data)
      }
    }
    function error (result, textStatus, error) {
      if (result.status === 0) {
        reject(new Error('Internal jquery error'))
      } else {
        const data = nonVoids(JSON.parse(result.responseText))
        reject(new Error(JSON.stringify(data)))
      }
    }
    function complete (result, textStatus) {
      console.log('END OF REST CALL')
    }
    $.ajax({type, url, dataType, crossDomain, contentType, async, data, xhrFields, success, error, complete})
  })
}

// Paste this utils function here as well to workaround a browserify problem
function nonVoids (input) {
  let output = {}
  for (let attr in input) {
    if (Object.keys(input[attr]).length > 0) { // input[attr] is either array or object
      output[attr] = input[attr]
    }
  }
  return output
}
// Paste this utils function here as well to workaround a browserify problem

module.exports = { jqueryJira }
