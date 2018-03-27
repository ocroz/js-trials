// import { Action } from 'redux';
import { Issue } from '../classes/issue';
import { IAppState, IAppData } from './model';
import { ViewActions, DataActions } from './actions';

// Reducer view
function viewReducer(state: string, action: any): string {
  switch (action.type) {
    case ViewActions.SET_VIEW:
      switch (action.view) {
        default:
          return action.view
      }
    default:
      const defaultState = state.replace(/\/$/, '') || '/'
      window.history.replaceState(null, null, defaultState)
      return defaultState
  }
}

// Reducer data
function dataReducer(state: IAppData, action: any): IAppData {
  let activeIssue = null
  switch (action.type) {
    case DataActions.ACTIVE_ISSUE:
      activeIssue = action.issuekey === null && state.issues.length > 0
        ? state.issues[0].key : action.issuekey
      return {isFetching: state.isFetching, issues: state.issues, activeIssue}
    case DataActions.GET_ISSUES:
    case DataActions.POST_ISSUE:
    case DataActions.POST_COMMENT:
    case DataActions.DELETE_ISSUE:
    case DataActions.DELETE_COMMENT:
    case DataActions.PUT_ISSUE:
    case DataActions.PUT_COMMENT:
    case DataActions.RANK_ISSUES:
      return {isFetching: true, issues: state.issues, activeIssue: state.activeIssue}
    case DataActions.RECEIVE_OK:
    case DataActions.RECEIVE_ERROR:
      return {isFetching: false, issues: state.issues, activeIssue: state.activeIssue}
    case DataActions.RECEIVE_ISSUES:
      activeIssue = action.issues.length === 0 ? null
        : (state.activeIssue === null ? action.issues[0].key
          : (action.issues.findIndex((issue: Issue) => issue.key === state.activeIssue) === -1
            ? action.issues[0].key : state.activeIssue))
      return {isFetching: false, issues: action.issues, activeIssue}
    default:
      return state
  }
}

// Reducers
export function rootReducer(state: IAppState, action: any): IAppState {
  return {
    data: dataReducer(state.data, action),
    view: viewReducer(state.view, action),
  }
}
