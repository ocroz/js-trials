import { Component, OnInit } from '@angular/core';
import { NgRedux, select, select$ } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

import { Issue } from '../classes/issue';
import { IAppState } from '../store/model';
import { StoreModule } from '../store/store.module';
import { DataActions } from '../store/actions';
import { IssueService }  from '../services/issue.service';

@Component({
  selector: 'app-issues-box',
  templateUrl: './issues-box.component.html',
  styleUrls: ['./issues-box.component.css']
})
export class IssuesBoxComponent implements OnInit {

  private store: NgRedux<IAppState>;
  private issues$: Observable<Issue[]>;
  private selectedIssue: Issue;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private storeModule: StoreModule,
    private dataActions: DataActions,
    private issueService: IssueService,
  ) {
    this.store = storeModule.store;
  }

  ngOnInit() {
    this.issues$ = this.ngRedux.select('issues');
    if (!this.store.getState().isFetching) {
      this.getIssues();
    }

    this.ngRedux.select('activeIssue').subscribe((key: string) => {
      this.selectedIssue = this.issueService.getIssue(key);
    })
  }

  onSelect(issue: Issue): void {
    this.dataActions.setActiveIssue(issue.key);
  }

  getIssues(): void {
    this.issueService.getIssues();
  }

  addFakeIssue(): void {
    this.issueService.addFakeIssue();
  }

}
