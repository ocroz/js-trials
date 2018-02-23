'use strict'

/* eslint-disable no-unused-vars */

/* globals fetch fetchData receiveIssues receiveOK receiveError closeModal loopNext */

const jiraUrl = 'http://localhost:4545/jira' // we use app-mock-jira
const jiraApi = `${jiraUrl}/rest/api/2`
const jiraAgile = `${jiraUrl}/rest/agile/1.0`

//
// Service part - Glue
//

function getIssues (dispatch, next) {
  return dispatch => {
    dispatch(fetchData('GET_ISSUES'))
    return fetch(`${jiraApi}/search`)
      .then(response => response.json())
      .then(json => dispatch(receiveIssues(json)))
      .then(() => next && next())
  }
}

function addFakeIssue (dispatch, next) {
  return dispatch => {
    dispatch(fetchData('ADD_ISSUE'))
    return fetch(`${jiraApi}/issue/fake`)
      .then(json => dispatch(receiveOK(json)))
      .catch(error => dispatch(receiveError(error)))
      .then(() => next && next())
  }
}

function submitIssue (dispatch, {summary, description}) {
  const fields = {
    project: { key: 'SPLPRJ' },
    issuetype: { name: 'Bug' },
    reporter: { name: 'crozier' },
    assignee: { name: 'crozier' },
    summary: summary.value,
    description: description && description.value
  }
  const issue = { fields }
  // console.log(issue)
  dispatch(postIssue(dispatch, issue, () => dispatch(getIssues(dispatch))))
}

function postIssue (dispatch, input, next) {
  return dispatch => {
    dispatch(fetchData('POST_ISSUE', {input}))
    const headers = { 'Content-Type': 'application/json' }
    const method = 'POST'
    const body = JSON.stringify(input)
    return fetch(`${jiraApi}/issue`, {headers, method, body})
      .then(response => response.json())
      .then(json => dispatch(receiveOK(json)))
      .catch(error => dispatch(receiveError(error)))
      .then(() => next && next())
  }
}

function deleteIssue (dispatch, issuekey, next) {
  return dispatch => {
    dispatch(fetchData('DELETE_ISSUE', {issuekey}))
    return fetch(`${jiraApi}/issue/${issuekey}`, {method: 'DELETE'})
      .then(json => dispatch(receiveOK(json)))
      .catch(error => dispatch(receiveError(error)))
      .then(() => next && next())
  }
}

function submitComment (dispatch, issuekey, comment) {
  dispatch(postComment(dispatch, issuekey, {body: comment}, () => dispatch(getIssues(dispatch))))
}

function postComment (dispatch, issuekey, input, next) {
  return dispatch => {
    dispatch(fetchData('POST_COMMENT', {issuekey, input}))
    const headers = { 'Content-Type': 'application/json' }
    const method = 'POST'
    const body = JSON.stringify(input)
    return fetch(`${jiraApi}/issue/${issuekey}/comment`, {headers, method, body})
      .then(json => dispatch(receiveOK(json)))
      .catch(error => dispatch(receiveError(error)))
      .then(() => next && next())
  }
}

function deleteComment (dispatch, issuekey, commentid) {
  dispatch(_deleteComment(dispatch, issuekey, commentid, () => dispatch(getIssues(dispatch))))

  function _deleteComment (dispatch, issuekey, commentid, next) {
    return dispatch => {
      dispatch(fetchData('DELETE_COMMENT', {issuekey, commentid}))
      const headers = { 'Content-Type': 'application/json' }
      const method = 'DELETE'
      return fetch(`${jiraApi}/issue/${issuekey}/comment/${commentid}`, {headers, method})
        .then(json => dispatch(receiveOK(json)))
        .catch(error => dispatch(receiveError(error)))
        .then(() => next && next())
    }
  }
}

function rankIssues (dispatch, input, next) {
  return dispatch => {
    dispatch(fetchData('RANK_ISSUES', {input}))
    const headers = { 'Content-Type': 'application/json' }
    const method = 'PUT'
    const body = JSON.stringify(input)
    return fetch(`${jiraAgile}/issue/rank`, {headers, method, body})
      .then(json => dispatch(receiveOK(json)))
      .catch(error => dispatch(receiveError(error)))
      .then(() => next && next())
  }
}
