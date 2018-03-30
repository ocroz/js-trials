import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgRedux, select$ } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import * as Moment from 'moment';

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
  @select$(['data', 'isFetching'], null) isFetching$: Observable<boolean>;

  private store: NgRedux<IAppState>;
  private iconSize = "16px;"
  private isCommentOpen = false;
  // private commentRows = 1;

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
      } else {
        // Subcribe to get further updates on issue fields or comments
        this.ngRedux.select(['data', 'issues']).subscribe((issues: Issue[]) => {
          this.issue = this.issueService.getIssue(this.store.getState().data.activeIssue);
        })
      }
    }
  }

  deleteIssue(): void {
    this.viewActions.setView('/issues');
    this.issueService.deleteIssue(this.issue.key);
  }

  deleteComment(comment: {id: string}): void {
    this.issueService.deleteComment(this.issue.key, comment.id);
  }

  closeComment(commentBox: any): void {
    commentBox.value = ''
    // commentBox.rows = this.commentRows
    this.isCommentOpen = false;
  }

  submitComment(event: any): void {
    event.preventDefault();
    this.issueService.postComment(this.issue.key, {body: event.target[0].value});
    this.closeComment(event.target[0]);
  }

  blurComment(event: any): void {
    if (!event.relatedTarget || event.relatedTarget.type !== 'submit') {
      this.closeComment(event.currentTarget)
    }
  }

  focusComment(event: any): void {
    // this.commentRows = event.target.rows
    // event.target.rows = 3
    this.isCommentOpen = true;
  }

  momentFromNow(time: string): string {
    return Moment(time).fromNow()
  }

  momentFormatted(time: string): string {
    return Moment(time).format('YYYY/MM/DD HH:mm:ss')
  }
}
