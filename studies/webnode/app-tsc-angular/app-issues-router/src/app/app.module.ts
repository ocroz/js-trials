import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

import { AppRootComponent } from './app-root/app-root.component';
import { IssueComponent } from './issue/issue.component';
import { IssueBoxComponent } from './issue-box/issue-box.component';
import { IssuesBoxComponent } from './issues-box/issues-box.component';

import { IssueService } from './services/issue.service';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  declarations: [
    AppRootComponent,
    IssueComponent,
    IssueBoxComponent,
    IssuesBoxComponent
  ],
  providers: [
    IssueService
  ],
  bootstrap: [
    AppRootComponent
  ]
})
export class AppModule { }
