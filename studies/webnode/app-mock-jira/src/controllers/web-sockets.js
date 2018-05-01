'use strict'

const io = require('socket.io')({path: '/ws'})

let sockets = {}

function attachWebSockets (server) {
  io.listen(server)

  io.sockets.on('connection', function (socket, issueKey) {
    console.log('Connecting socket', socket.id, 'from', socket.handshake.headers.referer, '...')

    socket.on('subscribe', function (issueKey) {
      console.log('Subscribing socket', socket.id, 'to issue', issueKey, '...')
      socket.issueKey = issueKey
      sockets[socket.id] = socket
    })
  })
}

function broadcast (issue) {
  for (let id in sockets) {
    if (sockets[id].issueKey === issue.key) {
      console.log('Broadcasting issue', issue.key, 'to socket', sockets[id].id, '...')
      sockets[id].emit('issue updated', issue)
    }
  }
}

module.exports = { attachWebSockets, broadcast }
