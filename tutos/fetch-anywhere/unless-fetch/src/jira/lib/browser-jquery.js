'use strict'

/* globals $ */

async function jqueryJira (jiraConfig = {}, method = 'GET', request = 'api/2/myself', input) {
  // jiraConfig = {jiraUrl, getFetch, getAuthHeader, agent, nonVoids} // header and agent are undefined in browser
  for (let attr of ['jiraUrl', 'nonVoids']) {
    if (!jiraConfig[attr]) { throw new Error(`jqueryJira: ${attr} is undefined`) }
  }

  // jquery parameters
  const url = jiraConfig.jiraUrl + '/rest/' + request
  const data = input && JSON.stringify(input)
  const [type, crossDomain, contentType, dataType, async, xhrFields] = // use dataType over accept
    [method, true, 'application/json', 'json', true, {withCredentials: true}]

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
        const data = jiraConfig.nonVoids(JSON.parse(result.responseText))
        reject(new Error(JSON.stringify(data)))
      }
    }
    function complete (result, textStatus) {
      console.log('END OF REST CALL')
    }
    $.ajax({type, url, crossDomain, contentType, dataType, async, data, xhrFields, success, error, complete})
  })
}

module.exports = { jqueryJira }
