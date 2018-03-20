import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { Issue } from '../classes/issue';
import { IAppState } from './model';

@Injectable()
export class DataActions {
  static ACTIVE_ISSUE = 'ACTIVE_ISSUE';
  static GET_ISSUE = 'GET_ISSUE';
  static GET_ISSUES = 'GET_ISSUES';
  static POST_ISSUE = 'POST_ISSUE';
  static POST_COMMENT = 'POST_COMMENT';
  static DELETE_ISSUE = 'DELETE_ISSUE';
  static DELETE_COMMENT = 'DELETE_COMMENT';
  static PUT_ISSUE = 'PUT_ISSUE';
  static PUT_COMMENT = 'PUT_COMMENT';
  static RANK_ISSUES = 'RANK_ISSUES';
  static RECEIVE_OK = 'RECEIVE_OK';
  static RECEIVE_ERROR = 'RECEIVE_ERROR';
  static RECEIVE_ISSUES = 'RECEIVE_ISSUES';

  constructor(private ngRedux: NgRedux<IAppState>) {}

  setActiveIssue(issuekey: string) {
    // console.log('setActiveIssue()')
    this.ngRedux.dispatch({ type: DataActions.ACTIVE_ISSUE, issuekey });
  }

  getIssue(issuekey: string) {
    this.ngRedux.dispatch({ type: DataActions.GET_ISSUE, issuekey });
  }

  fetchData (type = 'GET_ISSUES', data: {issuekey: string, commentid: number, input: any}) {
    const {issuekey, commentid, input} = data || {issuekey: undefined, commentid: undefined, input: undefined}
    // type is one of GET_ISSUES, DELETE_ISSUE, POST_ISSUE, PUT_ISSUE, POST_COMMENT, DELETE_COMMENT, PUT_COMMENT, RANK_ISSUES
    let action = undefined
    switch (type) {
      case DataActions.DELETE_ISSUE:
        action = { type, issuekey }; break;
      case DataActions.POST_ISSUE:
        action = { type, input }; break;
      case DataActions.PUT_ISSUE:
        action = { type, issuekey, input }; break;
      case DataActions.DELETE_COMMENT:
        action = { type, issuekey, commentid }; break;
      case DataActions.POST_COMMENT:
        action = { type, issuekey, input }; break;
      case DataActions.PUT_COMMENT:
        action = { type, issuekey, commentid, input }; break;
      case DataActions.RANK_ISSUES:
        action = { type, input }; break;
      default:
        action = { type }; break;
    }
    this.ngRedux.dispatch(action);
  }

  receiveIssues (issues: Issue[]) {
    this.ngRedux.dispatch({ type: DataActions.RECEIVE_ISSUES, issues });
  }

  receiveOK (status: any) {
    this.ngRedux.dispatch({ type: DataActions.RECEIVE_OK, status });
  }

  receiveError (error: any) {
    this.ngRedux.dispatch({ type: DataActions.RECEIVE_ERROR, error });
  }
}
