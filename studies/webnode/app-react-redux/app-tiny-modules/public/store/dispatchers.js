'use strict'

/* eslint-disable no-unused-vars */

/* globals SET_VIEW ACTIVE_ISSUE */
/* globals GET_ISSUES POST_ISSUE POST_COMMENT DELETE_ISSUE DELETE_COMMENT PUT_ISSUE PUT_COMMENT RANK_ISSUES */
/* globals RECEIVE_OK RECEIVE_ERROR RECEIVE_ISSUES */
/* globals OPEN_MODAL CLOSE_MODAL OPEN_COMMENT CLOSE_COMMENT LOOP_NEXT */

// Actions
const setView = view => {
  return { type: SET_VIEW, view }
}
const setActiveIssue = issuekey => {
  return { type: ACTIVE_ISSUE, issuekey }
}
const fetchData = (type = 'GET_ISSUES', data) => {
  const {issuekey, commentid, input} = data || {issuekey: undefined, commentid: undefined, input: undefined}
  // type is one of GET_ISSUES, DELETE_ISSUE, POST_ISSUE, PUT_ISSUE, POST_COMMENT, DELETE_COMMENT, PUT_COMMENT, RANK_ISSUES
  switch (type) {
    case DELETE_ISSUE:
      return {type, issuekey}
    case POST_ISSUE:
      return {type, input}
    case PUT_ISSUE:
      return {type, issuekey, input}
    case DELETE_COMMENT:
      return {type, issuekey, commentid}
    case POST_COMMENT:
      return {type, issuekey, input}
    case PUT_COMMENT:
      return {type, issuekey, commentid, input}
    case RANK_ISSUES:
      return {type, input}
    default:
      return {type}
  }
}
const receiveIssues = json => {
  return { type: RECEIVE_ISSUES, issues: json.issues }
}
const receiveOK = status => {
  return { type: RECEIVE_OK, status }
}
const receiveError = error => {
  console.error(error)
  return { type: RECEIVE_ERROR, error }
}
const openModal = () => {
  return { type: OPEN_MODAL }
}
const closeModal = () => {
  return { type: CLOSE_MODAL }
}
const openComment = () => {
  return { type: OPEN_COMMENT }
}
const closeComment = () => {
  return { type: CLOSE_COMMENT }
}
