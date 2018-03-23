import { Issue } from '../classes/issue';

export interface IAppData {
  isFetching: boolean,
  issues: Issue[],
  activeIssue: string,
};

const INITIAL_DATA: IAppData = {
  isFetching: false,
  issues: [],
  activeIssue: null,
};

const INITIAL_VIEW: string = window.location.pathname;

export interface IAppState {
  data: IAppData,
  view: string,
};

export const INITIAL_STATE: IAppState = {
  data: INITIAL_DATA,
  view: INITIAL_VIEW,
};
