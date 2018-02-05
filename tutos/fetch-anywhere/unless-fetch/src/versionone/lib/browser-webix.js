'use strict'

/* globals webix */

async function _webixVone (voneConfig = {}, method = 'GET', request = 'rest-1.v1/Data/Scope/0', input) {
  // voneConfig = {voneUrl, nonVoids} // header and agent are undefined in browser
  for (let attr of ['voneUrl', 'nonVoids']) {
    if (!voneConfig[attr]) { throw new Error(`webixVone: ${attr} is undefined`) }
  }
  const { voneUrl, nonVoids } = voneConfig

  // webix parameters
  const url = voneUrl + '/' + request
  const body = input && JSON.stringify(input)

  // webix promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    function onBeforeAjax (mode, url, data, request, headers, files, promise) {
      request.withCredentials = true // request = xhr
      headers['Accept'] = 'application/json'
      headers['Content-type'] = 'application/json'
    }
    function success (text, body, ajax) {
      const { status, statusText } = ajax
      const data = text ? body.json() : { success: true, status, statusText }
      const whoami = ajax.getResponseHeader('v1-memberid')
      resolve({whoami, data})
    }
    function error (text, body, ajax) {
      text && reject(new Error(JSON.stringify(nonVoids(body.json()))))
      reject(new Error('Internal webix error'))
    }
    function complete () {
      console.log('END OF REST CALL')
    }
    webix.attachEvent('onBeforeAjax', onBeforeAjax)
    try {
      webix.ajax()[method.toLowerCase().replace('delete', 'del')](url, body, {error, success}).then(complete)
    } catch (err) {
      reject(new Error(`${err}\n on request ${JSON.stringify({url, method, body})}`))
    }
  })
}

function webixVone (voneConfig, method, request, input) {
  return (method && request)
    ? _webixVone(voneConfig, method, request, input).then(res => res.data)
    : _webixVone(voneConfig, method, request, input).then(res => res.whoami)
}

module.exports = { webixVone }
