'use strict'

/* globals XMLHttpRequest */

async function _xhrVone (voneConfig = {}, method = 'GET', request = 'rest-1.v1/Data/Scope/0', input) {
  // voneConfig = {voneUrl, nonVoids} // header and agent are undefined in browser
  for (let attr of ['voneUrl', 'nonVoids']) {
    if (!voneConfig[attr]) { throw new Error(`xhrVone: ${attr} is undefined`) }
  }
  const { voneUrl, nonVoids } = voneConfig

  // xhr parameters
  const url = voneUrl + '/' + request
  const body = input && JSON.stringify(input)
  const xasync = true

  // xhr promise
  console.log('BEGINNING OF REST CALL')
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url, xasync)
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.withCredentials = true
    xhr.onload = function () {
      const { status, statusText } = xhr
      const success = (status >= 200 && status < 300)
      const body = xhr.response && JSON.parse(xhr.response)
      const data = (xhr.status === 204) ? { success, status, statusText } : body // 204 means statusText === 'No Content'
      const whoami = xhr.getResponseHeader('v1-memberid')
      if (success) {
        resolve({whoami, data})
      } else {
        reject(new Error(JSON.stringify(nonVoids(data))))
      }
    }
    xhr.onerror = function () {
      reject(new Error('Internal XMLHttpRequest error'))
    }
    xhr.onloadend = function () {
      console.log('END OF REST CALL')
    }
    xhr.send(body)
  })
}

function xhrVone (voneConfig, method, request, input) {
  return (method && request)
    ? _xhrVone(voneConfig, method, request, input).then(res => res.data)
    : _xhrVone(voneConfig, method, request, input).then(res => res.whoami)
}

module.exports = { xhrVone }
