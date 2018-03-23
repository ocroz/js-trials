import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';

import { IAppState } from '../store/model';
import { StoreModule } from '../store/store.module';

@Component({
  selector: 'app-root',
  templateUrl: './app-root.component.html',
  styleUrls: ['./app-root.component.css']
})
export class AppRootComponent implements OnInit {
  private title = 'Issues Store';

  private matches: object = null;
  private store: NgRedux<IAppState>;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private storeModule: StoreModule,
  ) {
    this.store = storeModule.store;
  }

  ngOnInit() {
    this.ngRedux.select('view').subscribe((view: string) => {
      this.matches = view.match('/issue/([^/]*)')
    })
  }
}
