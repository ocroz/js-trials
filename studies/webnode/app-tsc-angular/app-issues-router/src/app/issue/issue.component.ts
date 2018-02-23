import { Component, OnInit, Input } from '@angular/core';
import { Issue } from '../classes/issue';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css']
})
export class IssueComponent implements OnInit {

  @Input() issue: Issue;

  constructor() { }

  ngOnInit() {
  }

}
