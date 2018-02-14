'use strict'

/* globals combineReducers */

/* globals SET_VIEW ACTIVE_ISSUE */
/* globals GET_ISSUES POST_ISSUE POST_COMMENT DELETE_ISSUE DELETE_COMMENT PUT_ISSUE PUT_COMMENT */
/* globals RECEIVE_OK RECEIVE_ERROR RECEIVE_ISSUES */
/* globals OPEN_MODAL CLOSE_MODAL OPEN_COMMENT CLOSE_COMMENT */

// Reducer view
const viewDefaultState = window.location.pathname
const viewReducer = (state= viewDefaultState, action) => {
  switch (action.type) {
    case SET_VIEW:
      switch (action.view) {
        case '/':
        case '/search':
        case (action.view.match('/issue/([^/]*)') || {}).input:
          return action.view
        case (action.view.match('/search/([^/]*)') || {}).input:
        case '/issue':
          return '/search'
        default:
          return '/'
      }
    default:
      return state
  }
}

// Reducer data
const dataDefaultState = {isFetching: false, issues: [], activeIssue: null}
const dataReducer = (state = dataDefaultState, action) => {
  let activeIssue = null
  switch (action.type) {
    case ACTIVE_ISSUE:
      activeIssue = action.issuekey === null && state.issues.length > 0
        ? state.issues[0].key : action.issuekey
      return {isFetching: state.isFetching, issues: state.issues, activeIssue}
    case GET_ISSUES:
    case POST_ISSUE:
    case POST_COMMENT:
    case DELETE_ISSUE:
    case DELETE_COMMENT:
    case PUT_ISSUE:
    case PUT_COMMENT:
      return {isFetching: true, issues: state.issues, activeIssue: state.activeIssue}
    case RECEIVE_OK:
    case RECEIVE_ERROR:
      return {isFetching: false, issues: state.issues, activeIssue: state.activeIssue}
    case RECEIVE_ISSUES:
      activeIssue = action.issues.length === 0 ? null
        : (state.activeIssue === null ? action.issues[0].key
          : (action.issues.findIndex(issue => issue.key === state.activeIssue) === -1
            ? action.issues[0].key : state.activeIssue))
      return {isFetching: false, issues: action.issues, activeIssue}
    default:
      return state
  }
}

// Reducer modal
const modalDefaultState = {isOpen: false}
const modalReducer = (state = modalDefaultState, action) => {
  switch (action.type) {
    case OPEN_MODAL:
      return {isOpen: true}
    case CLOSE_MODAL:
      return {isOpen: false}
    default:
      return state
  }
}

// Reducer comment
const commentDefaultState = {isOpen: false}
const commentReducer = (state = commentDefaultState, action) => {
  switch (action.type) {
    case OPEN_COMMENT:
      return {isOpen: true}
    case CLOSE_COMMENT:
      return {isOpen: false}
    default:
      return state
  }
}

// Reducers
/* The appDefaultState fails with combineReducers(): See https://github.com/reactjs/redux/issues/1431
const appDefaultState = { // eslint-disable-line no-unused-vars
  view: viewDefaultState,
  data: dataDefaultState,
  modal: modalDefaultState,
  comment: commentDefaultState
}
*/
const appDefaultState = undefined // eslint-disable-line no-unused-vars
const appReducers = combineReducers({ // eslint-disable-line no-unused-vars
  view: viewReducer,
  data: dataReducer,
  modal: modalReducer,
  comment: commentReducer
})
