import { NgModule } from '@angular/core';
import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { createLogger } from 'redux-logger';

import { IAppState, INITIAL_STATE } from './model';
import { rootReducer } from './reducers';

@NgModule({
  imports: [NgReduxModule],
  providers: [],
})
export class StoreModule {
  static store: NgRedux<IAppState>;

  constructor(
    public store: NgRedux<IAppState>,
  ) {
    this.store = store;
    store.configureStore(
      rootReducer,
      INITIAL_STATE,
      [ createLogger() ],
    );
  }
}
