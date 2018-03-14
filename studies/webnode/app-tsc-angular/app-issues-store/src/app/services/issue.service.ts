import { Injectable } from '@angular/core';
import { Issue } from '../classes/issue';
import { ISSUES } from '../mocks/mock-issues';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
// import { MessageService } from './message.service';

import { DataActions } from '../store/actions';

@Injectable()
export class IssueService {
  issues: Issue[] = ISSUES

  constructor(
    // private messageService: MessageService
    private dataActions: DataActions,
  ) { }

  getIssues(): Observable<Issue[]> {
    // console.log('getIssues()')
    // this.messageService.add('HeroService: fetched heroes');
    this.dataActions.fetchData(DataActions.GET_ISSUES, null);
    this.dataActions.receiveIssues({ issues: this.issues.filter(issue => issue.active) });
    return of(this.issues.filter(issue => issue.active));
  }

  getIssue(key: string): Observable<Issue> {
    // console.log(`getIssue(${key})`)
    // this.messageService.add(`HeroService: fetched hero id=${id}`);
    // this.dataActions.getIssue(key);
    return of(this.issues.find(issue => issue.key === key));
  }

  addFakeIssue(): void {
    // console.log('addFakeIssue()')
    const projectkey = 'SPLPRJ'
    const key = `${projectkey}-${this.issues.length + 1}`
    this.issues[this.issues.length] = { active: true, key, fields: { summary: 'Fake issue' } }
  }

  deleteIssue(key: string): void {
    // console.log(`deleteIssue(${key})`)
    this.dataActions.fetchData(DataActions.DELETE_ISSUE, { issuekey: key, commentid: null, input: null });
    const issueIndex = this.issues.findIndex(issue => issue.key === key)
    this.issues[issueIndex].active = false
    this.dataActions.receiveOK(null);
  }

}
