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
// Redux part - Logic
//

// Reducer view
const view = (state = window.location.pathname, action) => {
  switch (action.type) {
    case 'SET_VIEW':
      switch (action.view) {
        case '/':
        case '/search':
        case '/api':
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

const url = (state = '/', action) => {
  switch (action.type) {
    case 'SET_URL':
      return action.url
    default:
      return state
  }
}

const issues = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_ISSUES':
      return action.issues
    default:
      return state
  }
}

// Reducers
const app = combineReducers({
  view,
  url,
  issues
})

// Actions
const setView = view => {
  return {
    type: 'SET_VIEW',
    view
  }
}
const setUrl = url => {
  return {
    type: 'SET_URL',
    url
  }
}
const receiveIssues = (json) => {
  return {
    type: 'RECEIVE_ISSUES',
    issues: json.issues
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
    <ViewGoto view='/'>
      Home
    </ViewGoto>
    {', '}
    <ViewGoto view='/search'>
      Search
    </ViewGoto>
    <IssueGoto />
  </p>
)

const Goto = ({ active, view, children, onClick }) => {
  if (active) {
    return <span>{children}</span>
  }

  return <Link to={view} onClick={onClick}>{children}</Link>
}

const mapViewGoto = {

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

const ViewGoto = connect(
  mapViewGoto.mapStateToProps,
  mapViewGoto.mapDispatchToProps
)(Goto)

const IssueGoto = () => {
  const matches = store.getState().view.match('/issue/([^/]*)')
  if (matches !== null) {
    return (
      <span>
        {', '}
        <ViewGoto view={matches[0]}>
          {matches[1]}
        </ViewGoto>
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
      <Route exact path='/search' component={IssueBoxContainer} />
      <Route path='/issue/:key' component={CommentBox} />
      <Redirect to={store.getState().view} />
    </Switch>
  </div>
)

const Home = () => (
  <div>
    <p>Home</p>
  </div>
)

const Api = ({ url, children, onClick }) => {
  return <button onClick={onClick}>{children}</button>
}

function fetchUrl (dispatch, url) {
  return dispatch => {
    dispatch(setUrl(url))
    return fetch(`${window.location.origin}${url}`)
      .then(response => response.json())
      .then(json => dispatch(receiveIssues(json)))
  }
}

const mapCallApi = {

  mapStateToProps: (state, ownProps) => {
    return {
      url: ownProps.url
    }
  },

  mapDispatchToProps: (dispatch, ownProps) => {
    return {
      onClick: () => {
        dispatch(fetchUrl(dispatch, ownProps.url))
      }
    }
  }

}

const CallApi = connect(
  mapCallApi.mapStateToProps,
  mapCallApi.mapDispatchToProps
)(Api)

const Issue = ({children}) => (
  <div>
    <li><ViewGoto view={`/issue/${children}`}>{children}</ViewGoto></li>
  </div>
)

class IssueBox extends Component {
  // componentDidMount () {
  //   const { dispatch } = this.props
  //   dispatch(fetchUrl(dispatch, '/api'))
  // }

  render () {
    const { issues } = this.props
    return (
      <div>
        <p>Search: <CallApi url='/api'>Refresh</CallApi></p>
        {issues.length === 0 && <p><b>Empty.</b></p>}
        {issues.map(issue => <Issue>{issue.key}</Issue>)}
      </div>
    )
  }
}

const mapIssueBox = {

  mapStateToProps: (state, ownProps) => {
    return {
      issues: state.issues
    }
  }

}

const IssueBoxContainer = connect(
  mapIssueBox.mapStateToProps
)(IssueBox)

const CommentBox = (props) => (
  <div>
    <p>Issue {props.match.params.key}</p>
  </div>
)

render(
  <Root />,
  document.getElementById('root')
)
