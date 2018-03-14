import { Component, OnInit, Input } from '@angular/core';
import { NgRedux, select, select$ } from '@angular-redux/store';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { StoreModule } from '../store/store.module';
import { Issue } from '../classes/issue';
import { IAppState } from '../store/model';
import { IssueService }  from '../services/issue.service';

@Component({
  selector: 'app-issue-box',
  templateUrl: './issue-box.component.html',
  styleUrls: ['./issue-box.component.css']
})
export class IssueBoxComponent implements OnInit {

  // @Input() issue: Issue;

  private store: NgRedux<IAppState>;
  private issue: Issue = null;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private storeModule: StoreModule,
    private route: ActivatedRoute,
    private issueService: IssueService
  ) {
    this.store = storeModule.store;
  }

  ngOnInit(): void {
    this.getIssue();
  }

  getIssue(): void {
    if (!this.store.getState().activeIssue) {
      const key = this.route.snapshot.paramMap.get('key');
      this.issueService.getIssue(key).subscribe(issue => this.issue = issue);
    } else {
      this.ngRedux.select('activeIssue').subscribe((key: string) => {
        this.issueService.getIssue(key).subscribe(issue => this.issue = issue);
      })
    }
  }

  deleteIssue(): void {
    this.issueService.deleteIssue(this.issue.key)
    this.issueService.getIssues();
  }

}
