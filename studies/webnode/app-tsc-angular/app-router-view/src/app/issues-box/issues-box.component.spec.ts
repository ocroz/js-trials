import { Component, Input } from '@angular/core';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesBoxComponent } from './issues-box.component';
import { Issue } from '../classes/issue';

describe('IssuesBoxComponent', () => {
  let component: IssuesBoxComponent;
  let fixture: ComponentFixture<IssuesBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        IssuesBoxComponent,
        MockIssueComponent,
        MockIssueBoxComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-issue',
  template: ''
})
class MockIssueComponent {
  @Input() issue: Issue;
}

@Component({
  selector: 'app-issue-box',
  template: ''
})
class MockIssueBoxComponent {
  @Input() issue: Issue;
}
