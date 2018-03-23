import { Component, OnInit, Input } from '@angular/core';
import { NgRedux, select, select$ } from '@angular-redux/store';

import { IAppState } from '../store/model';
import { StoreModule } from '../store/store.module';
import { ViewActions } from '../store/actions';

@Component({
  selector: 'link-view',
  templateUrl: './link-view.component.html',
  styleUrls: ['./link-view.component.css']
})
export class LinkViewComponent implements OnInit {

  @Input() view: string;
  @Input() name: string;
  private active: boolean = false;

  private store: NgRedux<IAppState>;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private storeModule: StoreModule,
    private viewActions: ViewActions,
  ) {
    this.store = storeModule.store;
  }

  ngOnInit() {
    this.ngRedux.select('view').subscribe((view: string) => {
      this.active = (this.view === view)
    })
  }

  onClick() {
    this.viewActions.setView(this.view);
  }
}
