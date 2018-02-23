import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Issue } from '../classes/issue';
import { IssueService }  from '../services/issue.service';

@Component({
  selector: 'app-issue-box',
  templateUrl: './issue-box.component.html',
  styleUrls: ['./issue-box.component.css']
})
export class IssueBoxComponent implements OnInit {

  @Input() issue: Issue;

  constructor(
    private route: ActivatedRoute,
    private issueService: IssueService
  ) { }

  ngOnInit(): void {
    this.getIssue();
  }

  getIssue(): void {
    if (!this.issue) {
      const key = this.route.snapshot.paramMap.get('key');
      this.issueService.getIssue(key)
        .subscribe(issue => this.issue = issue);
    }
  }

  deleteIssue(): void {
    this.issueService.deleteIssue(this.issue.key)
  }

}
