import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { NgReduxModule } from '@angular-redux/store';

import { AppRootComponent } from './app-root/app-root.component';
import { IssueComponent } from './issue/issue.component';
import { IssueBoxComponent } from './issue-box/issue-box.component';
import { IssuesBoxComponent } from './issues-box/issues-box.component';

import { StoreModule } from './store/store.module';
import { DataActions } from './store/actions';
import { IssueService } from './services/issue.service';

import { AppRoutingModule } from './app.routing.module';

@NgModule({
  imports:      [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    NgReduxModule,
    StoreModule,
  ],
  declarations: [
    AppRootComponent,
    IssueComponent,
    IssueBoxComponent,
    IssuesBoxComponent,
  ],
  providers: [
    StoreModule,
    DataActions,
    IssueService,
  ],
  bootstrap: [
    AppRootComponent,
  ]
})
export class AppModule { }
