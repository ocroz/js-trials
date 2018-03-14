import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IssuesBoxComponent }   from './issues-box/issues-box.component';
import { IssueBoxComponent }   from './issue-box/issue-box.component';

const routes: Routes = [
  { path: 'issues', component: IssuesBoxComponent },
  { path: 'issue/:key', component: IssueBoxComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
