import { Component, OnInit } from '@angular/core';
import { NgRedux, select, select$ } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

import { Issue } from '../classes/issue';
import { IAppState } from '../store/model';
import { StoreModule } from '../store/store.module';
import { IssueService }  from '../services/issue.service';

@Component({
  selector: 'app-issues-box',
  templateUrl: './issues-box.component.html',
  styleUrls: ['./issues-box.component.css']
})
export class IssuesBoxComponent implements OnInit {

  @select$(['data', 'issues'], null) issues$: Observable<Issue[]>;

  private store: NgRedux<IAppState>;
  private selectedIssue: Issue;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private storeModule: StoreModule,
    private issueService: IssueService,
  ) {
    this.store = storeModule.store;
  }

  ngOnInit() {
    if (!this.store.getState().data.isFetching) {
      this.getIssues();
    }

    this.ngRedux.select(['data', 'activeIssue']).subscribe((key: string) => {
      this.selectedIssue = this.issueService.getIssue(key);
    })
  }

  getIssues(): void {
    this.issueService.getIssues();
  }

  addFakeIssue(): void {
    this.issueService.addFakeIssue();
  }
}
