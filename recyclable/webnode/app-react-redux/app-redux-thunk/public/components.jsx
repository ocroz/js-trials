'use strict'
const { Component } = window.React
const { render } = window.ReactDOM
const { BrowserRouter, Route, Link, Switch, Redirect } = window.ReactRouterDOM
const { combineReducers, createStore, applyMiddleware } = window.Redux
const { Provider, connect } = window.ReactRedux
const createLogger = window.reduxLogger
const thunkMiddleware = window.ReduxThunk.default
const fetch = window.fetch

//
// Model
//

/*
----
  Redux Store (state): view

  React Container: LinkView (view ie url pathname)
  React Component: -> LinkViewComp (view, onClick)
  Onclick Event: linkView (view)
  Redux Action: -> setView: SET_VIEW, view
  Redux Reducer: --> state.view = view

  React Container: LinkIssue (view ie url pathname)
  React Component: -> LinkIssueComp (view, onClick)
  Onclick Event: linkIssue (view)
  Redux Action: -> setView: SET_VIEW, view
  Redux Reducer: --> state.view = view
----
  Redux Store (state): data
  -> isFetching
  -> issues // Every issue has comments

  React Container: GetIssues ()
  React Component: -> GetIssuesComp (onClick)
  Onclick Event: getIssues (dispatch)
  1. Redux Action: -> fetchData: GET_ISSUES
     Redux Reducer: --> state.isFetching = true
  2. Redux Action: -> receiveIssues: RECEIVE_ISSUES, issues
     Redux Reducer: --> state.isFetching = false, state.issues = issues

  React Container: DeleteIssue (issuekey)
  React Component: -> DeleteIssueComp (issuekey, onClick)
  Onclick Event: deleteIssue (dispatch, issuekey)
  1. Redux Action: -> fetchData: DELETE_ISSUE, issuekey
     Redux Reducer: --> state.isFetching = true
  2. Redux Action: -> receiveStatus: RECEIVE_STATUS, status
     Redux Reducer: --> state.isFetching = false, state.status = status

  React Container: PostIssue ()
  React Component: -> postIssueComp (onClick)
  Onclick Event: postIssue (dispatch, formdata)
  1. Redux Action: -> fetchData: POST_ISSUE
     Redux Reducer: --> state.isFetching = true
  2. Redux Action: -> receiveStatus: RECEIVE_STATUS, status
     Redux Reducer: --> state.isFetching = false, state.status = status

  React: IssuesBox
  React: -> GetIssues
  React: -> n * Issue -> LinkIssue, DeleteIssue
  React: -> PostIssue

  ...

  React: IssueBox
  React: -> IssueFields -> PutIssue
  React: -> GetComments
  React: -> n * Comment -> DeleteComment
  React: -> PostComment
----
*/

//
// Redux part - Logic
//

// Reducer view
const view = (state = window.location.pathname, action) => {
  switch (action.type) {
    case 'SET_VIEW':
      switch (action.view) {
        case '/':
        case '/search':
        case (action.view.match('/issue/([^/]*)') || {}).input:
          return action.view
        case (action.view.match('/search/([^/]*)') || {}).input:
        case '/issue':
          return '/search'
        default:
          return '/'
      }
    default:
      return state
  }
}

// Reducer data
const data = (state = {isFetching: false, issues: []}, action) => {
  switch (action.type) {
    case 'GET_ISSUES':
    case 'POST_ISSUES':
      return {isFetching: true, issues: state.issues}
    case 'DELETE_ISSUE':
    case 'PUT_ISSUES':
      return {isFetching: true, issues: state.issues}
    case 'RECEIVE_STATUS':
      return {isFetching: false, issues: state.issues, status: action.status}
    case 'RECEIVE_ISSUES':
      return {isFetching: false, issues: action.issues}
    default:
      return state
  }
}

// Reducers
const app = combineReducers({
  view,
  data
})

// Actions
const setView = view => {
  return {
    type: 'SET_VIEW',
    view
  }
}
const fetchData = (type = 'GET_ISSUES', issuekey) => {
  // type is one of GET_ISSUES, DELETE_ISSUE, POST_ISSUE, PUT_ISSUE
  switch (type) {
    case 'DELETE_ISSUE':
    case 'PUT_ISSUE':
      return {type, issuekey}
    default:
      return {type}
  }
}
const receiveIssues = json => {
  return {
    type: 'RECEIVE_ISSUES',
    issues: json.issues
  }
}
const receiveStatus = json => {
  return {
    type: 'RECEIVE_STATUS',
    status: json
  }
}

// Create the store
const preloadedState = undefined
const loggerMiddleware = createLogger()
let store = createStore(
  app,
  preloadedState,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
)

//
// React part - UI
//

class Root extends Component {
  render () {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    )
  }
}

const App = () => (
  <div>
    <Header />
    <Main />
  </div>
)

const Header = () => (
  <p>
    Goto:
    {' '}
    <LinkView view='/'>
      Home
    </LinkView>
    {', '}
    <LinkView view='/search'>
      Search
    </LinkView>
    <LinkIssue />
  </p>
)

const LinkViewComp = ({ active, view, children, onClick }) => {
  if (active) {
    return <span>{children}</span>
  }

  return <Link to={view} onClick={onClick}>{children}</Link>
}

const mapLinkView = {
  mapStateToProps: (state, ownProps) => {
    return {
      active: ownProps.view === state.view,
      view: ownProps.view
    }
  },
  mapDispatchToProps: (dispatch, ownProps) => {
    return {
      onClick: () => {
        dispatch(setView(ownProps.view))
      }
    }
  }
}

const LinkView = connect(
  mapLinkView.mapStateToProps,
  mapLinkView.mapDispatchToProps
)(LinkViewComp)

const LinkIssue = () => {
  const matches = store.getState().view.match('/issue/([^/]*)')
  if (matches !== null) {
    return (
      <span>
        {', '}
        <LinkView view={matches[0]}>
          {matches[1]}
        </LinkView>
      </span>
    )
  } else {
    return <span>{''}</span>
  }
}

const Main = () => (
  <div>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/search' component={IssuesBox} />
      <Route path='/issue/:key' component={IssueBox} />
      <Redirect to={store.getState().view} />
    </Switch>
  </div>
)

const Home = () => (
  <div>
    <p>Home</p>
  </div>
)

class IssuesBoxComp extends Component {
  // componentDidMount () {
  //   const { dispatch } = this.props
  //   dispatch(getIssues(dispatch))
  // }

  render () {
    const { isFetching, issues } = this.props
    return (
      <div>
        <p>Search: <GetIssues>Refresh</GetIssues></p>
        {isFetching && issues.length === 0 && <p><b>Loading...</b></p>}
        {!isFetching && issues.length === 0 && <p><b>Empty.</b></p>}
        {issues.length > 0 &&
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            {issues.map(issue => <Issue>{issue}</Issue>)}
          </div>
        }
        <IssueForm />
      </div>
    )
  }
}

const mapIssuesBox = {
  mapStateToProps: (state, ownProps) => state.data,
  mapDispatchToProps: (dispatch, ownProps) => undefined
}

const IssuesBox = connect(
  mapIssuesBox.mapStateToProps,
  mapIssuesBox.mapDispatchToProps
)(IssuesBoxComp)

const GetIssuesComp = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>
}

function getIssues (dispatch) {
  return dispatch => {
    dispatch(fetchData('GET_ISSUES'))
    return fetch(`${window.location.origin}/api`)
      .then(response => response.json())
      .then(json => dispatch(receiveIssues(json)))
  }
}

const mapGetIssues = {
  mapStateToProps: (state, ownProps) => undefined,
  mapDispatchToProps: (dispatch, ownProps) => {
    return {
      onClick: () => {
        dispatch(getIssues(dispatch))
      }
    }
  }
}

const GetIssues = connect(
  mapGetIssues.mapStateToProps,
  mapGetIssues.mapDispatchToProps
)(GetIssuesComp)

const Issue = ({children: issue}) => (
  <div>
    <li>
      <LinkView view={`/issue/${issue.key}`}>{issue.key}</LinkView>
      {':'}
      {issue.fields.summary}
      {' '}
      (<DeleteIssue issuekey={issue.key}>Delete</DeleteIssue>)
    </li>
  </div>
)

const DeleteIssueComp = ({ children, onClick }) => (
  <button onClick={onClick}>{children}</button>
)

function deleteIssue (dispatch, issuekey) {
  return dispatch => {
    dispatch(fetchData('DELETE_ISSUE', issuekey))
    return fetch(`${window.location.origin}/api/${issuekey}`, {method: 'DELETE'})
      .then(response => response.json())
      .then(json => dispatch(receiveStatus(json)))
  }
}

const mapDeleteIssue = {
  mapStateToProps: (state, ownProps) => { return { issuekey: ownProps.issuekey } },
  mapDispatchToProps: (dispatch, ownProps) => {
    return {
      onClick: () => {
        dispatch(deleteIssue(dispatch, ownProps.issuekey))
      }
    }
  }
}

const DeleteIssue = connect(
  mapDeleteIssue.mapStateToProps,
  mapDeleteIssue.mapDispatchToProps
)(DeleteIssueComp)

const IssueForm = () => (
  <div>
    <p>Soon a form here</p>
  </div>
)

const IssueBox = (props) => (
  <div>
    <p>Issue {props.match.params.key}</p>
  </div>
)

render(
  <Root />,
  document.getElementById('root')
)
