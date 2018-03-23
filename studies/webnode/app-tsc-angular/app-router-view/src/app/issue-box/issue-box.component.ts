import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgRedux } from '@angular-redux/store';

import { Issue } from '../classes/issue';
import { IAppState } from '../store/model';
import { StoreModule } from '../store/store.module';
import { IssueService }  from '../services/issue.service';
import { DataActions, ViewActions } from '../store/actions';

@Component({
  selector: 'app-issue-box',
  templateUrl: './issue-box.component.html',
  styleUrls: ['./issue-box.component.css']
})
export class IssueBoxComponent implements OnInit {

  @Input() issue: Issue;

  private store: NgRedux<IAppState>;

  constructor(
    private route: ActivatedRoute,
    private ngRedux: NgRedux<IAppState>,
    private storeModule: StoreModule,
    private issueService: IssueService,
    private dataActions: DataActions,
    private viewActions: ViewActions,
  ) {
    this.store = storeModule.store;
  }

  ngOnInit(): void {
    if (!this.issue) {
      // We navigate to this page
      const key = this.route.snapshot.paramMap.get('key');
      this.issue = this.issueService.getIssue(key);

      // We open the app at any page
      if (!this.issue) {
        // Subscribe to getIssue(key) and setActiveIssue(this.issue.key) for navigation consistency
        this.ngRedux.select(['data', 'issues']).subscribe((issues: Issue[]) => {
          this.issue = this.issueService.getIssue(key);
          if (this.issue && this.issue.key !== this.store.getState().data.activeIssue) {
            this.dataActions.setActiveIssue(this.issue.key);
          }
        })
        // No need to getIssues() twice here and from parent
        if (!this.store.getState().data.isFetching) {
          this.issueService.getIssues();
        }
      }
    }
  }

  deleteIssue(): void {
    this.viewActions.setView('/issues');
    this.issueService.deleteIssue(this.issue.key);
  }
}
