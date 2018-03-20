import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Issue } from '../classes/issue';

import { IssueBoxComponent } from './issue-box.component';

describe('IssueBoxComponent', () => {
  let component: IssueBoxComponent;
  let fixture: ComponentFixture<IssueBoxComponent>;
  const mockIssue: Issue = { active: true, key: 'SPLPRJ-0', fields: { summary: 'Mock issue' } };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueBoxComponent);
    component = fixture.componentInstance;
    component.issue = mockIssue;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
