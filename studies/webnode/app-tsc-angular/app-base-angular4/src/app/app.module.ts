import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

import { AppRootComponent } from './app-root/app-root.component';

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule
  ],
  declarations: [
    AppRootComponent
  ],
  providers: [
  ],
  bootstrap: [
    AppRootComponent
  ]
})
export class AppModule { }
