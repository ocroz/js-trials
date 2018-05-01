'use strict'

/* globals $ fetch io pug moment */

const socket = io.connect('/', {path: '/ws'})

const issueKey = window.location.pathname.replace(/.*\//, '')
wsSubscribe(issueKey)

let comments
fetch('/src/views/comments.pug').then(resp => resp.text()).then(text => { comments = text })

function wsSubscribe (issueKey) {
  console.log('Subscribing to', issueKey, '...')
  socket.emit('subscribe', issueKey)
}

socket.on('issue updated', function (issue) {
  console.log('Updating', issue.key, 'with comments', issue.fields.comment.comments, '...')
  $('div#comments')[0].innerHTML = pug.render(comments, { issue, moment })
  $('div#comments')[0].style.opacity = '0.5'
  setTimeout(() => {
    $('div#comments')[0].style.opacity = '1'
  }, 200)
})
