import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { NgReduxModule } from '@angular-redux/store';

import { AppRootComponent } from './app-root/app-root.component';
import { LinkViewComponent } from './link-view/link-view.component';
import { IssueComponent } from './issue/issue.component';
import { IssueBoxComponent } from './issue-box/issue-box.component';
import { IssuesBoxComponent } from './issues-box/issues-box.component';

import { StoreModule } from './store/store.module';
import { DataActions, ViewActions } from './store/actions';
import { IssueService } from './services/issue.service';

import { AppRoutingModule } from './app.routing.module';
import { AppStylesMatModule } from './app.styles.mat.module';

@NgModule({
  imports:      [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgReduxModule,
    StoreModule,
    AppRoutingModule,
    AppStylesMatModule,
  ],
  declarations: [
    AppRootComponent,
    IssueComponent,
    IssueBoxComponent,
    IssuesBoxComponent,
    LinkViewComponent,
  ],
  providers: [
    StoreModule,
    DataActions,
    ViewActions,
    IssueService,
  ],
  bootstrap: [
    AppRootComponent,
  ]
})
export class AppModule { }
