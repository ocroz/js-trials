'use strict'

/* globals socket store updateIssue */

socket.on('issue updated', function (issue) {
  // console.log('Updating', issue.key, 'with', issue, '...')
  store.dispatch(updateIssue(issue))
})
