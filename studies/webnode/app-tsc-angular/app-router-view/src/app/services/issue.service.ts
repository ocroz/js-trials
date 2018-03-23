import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { NgRedux } from '@angular-redux/store';

import { Issue } from '../classes/issue';
import { IAppState } from '../store/model';
import { StoreModule } from '../store/store.module';
import { DataActions } from '../store/actions';

const headers = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
const observe = 'response';

@Injectable()
export class IssueService {

  private jiraUrl: string = 'http://localhost:4545/jira' // we use app-mock-jira
  private jiraApi: string = `${this.jiraUrl}/rest/api/2`
  private jiraAgile: string = `${this.jiraUrl}/rest/agile/1.0`

  private store: NgRedux<IAppState>;

  constructor(
    private http: HttpClient,
    private storeModule: StoreModule,
    private dataActions: DataActions,
  ) {
    this.store = storeModule.store;
  }

  addFakeIssue(): void {
    const issue = { fields: {
      summary: 'Fake issue',
      project: { key: 'SPLPRJ' },
      issuetype: {'name': 'Task'},
    }};
    this.postIssue(issue);
  }

  getIssue(key: string): Issue {
    return this.store.getState().data.issues.find(issue => issue.key === key);
  }

  getIssues(): void {
    this.dataActions.fetchData(DataActions.GET_ISSUES, null);
    this.http.get<{ issues: Issue[]; }>(`${this.jiraApi}/search`, { headers })
      .map(data => data.issues)
      .subscribe(issues => {
        this.dataActions.receiveIssues(issues);
      }, error => {
        this.dataActions.receiveError(error);
      })
  }

  postIssue(issue: Issue): void {
    this.dataActions.fetchData(DataActions.POST_ISSUE, { issuekey: null, commentid:null, input: issue });
    this.http.post<any>(`${this.jiraApi}/issue`, issue, { headers, observe })
      .subscribe(res => {
        this.dataActions.receiveOK(res);
        this.getIssues();
      }, error => {
        this.dataActions.receiveError(error);
      });
  }

  deleteIssue(key: string): void {
    this.dataActions.fetchData(DataActions.DELETE_ISSUE, { issuekey: key, commentid: null, input: null });
    this.http.delete<any>(`${this.jiraApi}/issue/${key}`, { observe })
      .subscribe(res => {
        this.dataActions.receiveOK(res);
        this.getIssues();
      }, error => {
        this.dataActions.receiveError(error);
      });
  }

}
