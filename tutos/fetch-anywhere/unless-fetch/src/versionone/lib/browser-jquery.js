'use strict'

/* globals $ */

async function _jqueryVone (voneConfig = {}, method = 'GET', request = 'rest-1.v1/Data/Scope/0', input) {
  // voneConfig = {voneUrl, nonVoids} // header and agent are undefined in browser
  for (let attr of ['voneUrl', 'nonVoids']) {
    if (!voneConfig[attr]) { throw new Error(`jqueryVone: ${attr} is undefined`) }
  }
  const { voneUrl, nonVoids } = voneConfig

  // jquery parameters
  const url = voneUrl + '/' + request
  const data = input && JSON.stringify(input)
  const [type, crossDomain, contentType, dataType, async, xhrFields] = // use dataType over accept
    [method, true, 'application/json', 'json', true, {withCredentials: true}]

  // jquery promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    function success (body, textStatus, result) {
      const { status, statusText } = result
      const data = (status === 204) ? { textStatus, status, statusText } : body // 204 means statusText === 'No Content'
      const whoami = result.getResponseHeader('v1-memberid')
      resolve({whoami, data})
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
    $.ajax({type, url, crossDomain, contentType, dataType, async, data, xhrFields, success, error, complete})
  })
}

function jqueryVone (voneConfig, method, request, input) {
  return (method && request)
    ? _jqueryVone(voneConfig, method, request, input).then(res => res.data)
    : _jqueryVone(voneConfig, method, request, input).then(res => res.whoami)
}

module.exports = { jqueryVone }
