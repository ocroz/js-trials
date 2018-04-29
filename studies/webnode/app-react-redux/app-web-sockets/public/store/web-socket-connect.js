'use strict'

/* globals io wsUrl */

const socket = io.connect(wsUrl, {path: '/ws'})

function wsSubscribe (issueKey) { // eslint-disable-line no-unused-vars
  // console.log('Subscribing to', issueKey, '...')
  socket.emit('subscribe', issueKey)
}
