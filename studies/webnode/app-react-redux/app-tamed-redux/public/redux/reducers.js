const { combineReducers } = window.Redux

/* globals SET_VIEW */
/* globals ACTIVE_ISSUE */
/* globals GET_ISSUES POST_ISSUE POST_COMMENT */
/* globals DELETE_ISSUE DELETE_COMMENT PUT_ISSUE PUT_COMMENT RECEIVE_OK RECEIVE_ERROR */
/* globals RECEIVE_ISSUES */
/* globals OPEN_MODAL CLOSE_MODAL */
/* globals OPEN_COMMENT CLOSE_COMMENT */

// Reducer view
const view = (state = window.location.pathname, action) => {
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
const data = (state = {isFetching: false, issues: [], activeIssue: null}, action) => {
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
const modal = (state = {isOpen: false}, action) => {
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
const comment = (state = {isOpen: false}, action) => {
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
const app = combineReducers({ // eslint-disable-line no-unused-vars
  view,
  data,
  modal,
  comment
})
