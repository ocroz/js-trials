import { Component, OnInit, Input } from '@angular/core';
import { Issue } from '../classes/issue';
import { IssueService }  from '../services/issue.service';
import { DataActions } from '../store/actions';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css']
})
export class IssueComponent implements OnInit {

  @Input() issue: Issue;

  constructor(
    private issueService: IssueService,
    private dataActions: DataActions,
  ) { }

  ngOnInit() { }

  onClick() {
    this.dataActions.setActiveIssue(this.issue.key);
  }

  onDelete() {
    this.issueService.deleteIssue(this.issue.key);
  }
}
