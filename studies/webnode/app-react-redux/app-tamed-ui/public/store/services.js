'use strict'

/* eslint-disable no-unused-vars */

/* globals fetch fetchData receiveIssues receiveOK receiveError closeModal */

const jiraUrl = 'http://localhost:4545/jira/rest/api/2' // we use app-mock-jira

//
// Service part - Glue
//

function getIssues (dispatch) {
  return dispatch => {
    dispatch(fetchData('GET_ISSUES'))
    return fetch(`${jiraUrl}/search`)
      .then(response => response.json())
      .then(json => dispatch(receiveIssues(json)))
      // .catch(error => dispatch(receiveError(error)))
  }
}

function addFakeIssue (dispatch, next) {
  return dispatch => {
    dispatch(fetchData('ADD_ISSUE'))
    return fetch(`${jiraUrl}/issue/fake`)
      .then(json => dispatch(receiveOK(json)))
      .catch(error => dispatch(receiveError(error)))
      .then(() => next && dispatch(next(dispatch)))
  }
}

function submitIssue (dispatch, {summary, description}) {
  dispatch(closeModal())
  const fields = {
    project: { key: 'SPLPRJ' },
    issuetype: { name: 'Bug' },
    reporter: { name: 'crozier' },
    assignee: { name: 'crozier' },
    summary: summary.value,
    description: description.value
  }
  const issue = { fields }
  console.log(issue)
  dispatch(postIssue(dispatch, issue, getIssues))
}

function postIssue (dispatch, input, next) {
  return dispatch => {
    dispatch(fetchData('POST_ISSUE'))
    const headers = { 'Content-Type': 'application/json' }
    const method = 'POST'
    const body = JSON.stringify(input)
    return fetch(`${jiraUrl}/issue`, {headers, method, body})
      .then(response => response.json())
      .then(json => dispatch(receiveOK(json)))
      .catch(error => dispatch(receiveError(error)))
      .then(() => next && dispatch(next(dispatch)))
  }
}

function deleteIssue (dispatch, issuekey, next) {
  return dispatch => {
    dispatch(fetchData('DELETE_ISSUE', issuekey))
    return fetch(`${jiraUrl}/issue/${issuekey}`, {method: 'DELETE'})
      .then(json => dispatch(receiveOK(json)))
      .catch(error => dispatch(receiveError(error)))
      .then(() => next && dispatch(next(dispatch)))
  }
}

function submitComment (dispatch, issuekey, comment) {
  dispatch(postComment(dispatch, issuekey, {body: comment}, getIssues))
}

function postComment (dispatch, issuekey, input, next) {
  return dispatch => {
    dispatch(fetchData('POST_COMMENT'))
    const headers = { 'Content-Type': 'application/json' }
    const method = 'POST'
    const body = JSON.stringify(input)
    return fetch(`${jiraUrl}/issue/${issuekey}/comment`, {headers, method, body})
      .then(json => dispatch(receiveOK(json)))
      .catch(error => dispatch(receiveError(error)))
      .then(() => next && dispatch(next(dispatch)))
  }
}

function deleteComment (dispatch, issuekey, commentid) {
  dispatch(_deleteComment(dispatch, issuekey, commentid, getIssues))

  function _deleteComment (dispatch, issuekey, commentid, next) {
    return dispatch => {
      dispatch(fetchData('DELETE_COMMENT'))
      const headers = { 'Content-Type': 'application/json' }
      const method = 'DELETE'
      return fetch(`${jiraUrl}/issue/${issuekey}/comment/${commentid}`, {headers, method})
        .then(json => dispatch(receiveOK(json)))
        .catch(error => dispatch(receiveError(error)))
        .then(() => next && dispatch(next(dispatch)))
    }
  }
}
