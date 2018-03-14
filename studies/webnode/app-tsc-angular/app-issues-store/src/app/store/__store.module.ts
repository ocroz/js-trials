import {
  applyMiddleware,
  Store,
  combineReducers,
  compose,
  createStore
} from 'redux';
import { NgReduxModule, NgRedux } from '@angular-redux/core';
import reduxLogger from 'redux-logger';
import { rootReducer } from './reducers';
import { IAppState } from './model';

export const store: Store<IAppState> = createStore(
  rootReducer,
  // compose(applyMiddleware(reduxLogger)),
);

@NgModule({
  imports: [NgReduxModule],
  providers: [],
})
export class StoreModule {
  constructor(ngRedux: NgRedux<IAppState>) {
    ngRedux.provideStore(store);
  }
}
