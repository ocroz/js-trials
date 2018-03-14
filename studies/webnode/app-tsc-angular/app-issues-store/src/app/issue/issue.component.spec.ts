import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Issue } from '../classes/issue';

import { IssueComponent } from './issue.component';

describe('IssueComponent', () => {
  let component: IssueComponent;
  let fixture: ComponentFixture<IssueComponent>;
  const mockIssue: Issue = { active: true, key: 'SPLPRJ-0', fields: { summary: 'Mock issue' } };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueComponent);
    component = fixture.componentInstance;
    component.issue = mockIssue;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
