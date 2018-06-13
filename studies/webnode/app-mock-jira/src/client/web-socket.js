'use strict'

const $ = require('jquery')
const io = require('socket.io-client')
// const Window = require('window')
// const window = new Window()

const pug = require('pug')

// Compile the source code
const comments = pug.compileFile('src/views/comments.pug')

// const comments = require('../views/comments.pug')

const socket = io.connect('http://localhost:4545', {path: '/ws'})

function wsSubscribe (issueKey) { // eslint-disable-line no-unused-vars
  console.log('Subscribing to', issueKey, '...')
  socket.emit('subscribe', issueKey)
}

socket.on('issue updated', function (issue) {
  console.log('Updating', issue.key, 'with comments', issue.fields.comment.comments, '...')
  // window.location.reload()

  const container = $('div#comments')
  console.log(container)
  container.append(comments)
  // setTimeout(() => {
  //   container.find('tr.injected').removeClass('injected')
  // }, 0)
})

module.exports = { wsSubscribe }
