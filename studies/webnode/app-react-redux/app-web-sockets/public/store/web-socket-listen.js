'use strict'

/* globals socket store updateIssue receiveOK */

socket.on('issue updated', function (issue) {
  // console.log('Updating', issue.key, 'with', issue, '...')
  const isFetching = store.getState().data.isFetching
  store.dispatch(updateIssue(issue))
  !isFetching && setTimeout(() => {
    store.dispatch(receiveOK())
  }, 200)
})
