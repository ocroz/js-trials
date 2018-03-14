import { Issue } from '../classes/issue';

export interface IAppState {
  isFetching: boolean,
  issues: Issue[],
  activeIssue: string
}

export const INITIAL_STATE: IAppState = {
  isFetching: false,
  issues: [],
  activeIssue: null
};
