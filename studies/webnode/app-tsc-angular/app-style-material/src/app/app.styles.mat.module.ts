import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatGridListModule,
} from '@angular/material';

@NgModule({
  exports: [
    MatButtonModule,
    MatGridListModule,
  ],
})
export class AppStylesMatModule { }
