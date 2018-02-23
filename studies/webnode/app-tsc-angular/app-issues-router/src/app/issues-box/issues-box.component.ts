import { Component, OnInit } from '@angular/core';

import { Issue } from '../classes/issue';
import { IssueService }  from '../services/issue.service';
// import { ISSUES } from '../mocks/mock-issues';

@Component({
  selector: 'app-issues-box',
  templateUrl: './issues-box.component.html',
  styleUrls: ['./issues-box.component.css']
})
export class IssuesBoxComponent implements OnInit {

  // issues = ISSUES;
  // selectedIssue: Issue = ISSUES[0];

  issues: Issue[]
  selectedIssue: Issue

  constructor(
    private issueService: IssueService
  ) { }

  ngOnInit() {
    this.getIssues();
    this.selectedIssue = this.issues[0]
  }

  onSelect(issue: Issue): void {
    this.selectedIssue = issue;
  }

  getIssues(): void {
    this.issueService.getIssues()
      .subscribe(issues => this.issues = issues);
  }

  addFakeIssue(): void {
    this.issueService.addFakeIssue();
    this.getIssues();
  }

}
