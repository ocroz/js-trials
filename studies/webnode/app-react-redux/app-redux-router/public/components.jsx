'use strict'
const { Component } = window.React
const { render } = window.ReactDOM
const { BrowserRouter, Route, Link, Switch, Redirect } = window.ReactRouterDOM
const { combineReducers, createStore } = window.Redux
const { Provider, connect } = window.ReactRedux

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

// Reducers
const app = combineReducers({
  view
})

// Actions
const setView = view => {
  return {
    type: 'SET_VIEW',
    view
  }
}

// Create the store
let store = createStore(app)

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

const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.view === state.view,
    view: ownProps.view
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(setView(ownProps.view))
    }
  }
}

const ViewGoto = connect(
  mapStateToProps,
  mapDispatchToProps
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
      <Route exact path='/search' component={IssueBox} />
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

const IssueBox = () => (
  <div>
    <p>Search</p>
    <li><ViewGoto view='/issue/SPLPRJ-42'>SPLPRJ-42</ViewGoto></li>
    <li><ViewGoto view='/issue/SPLPRJ-43'>SPLPRJ-43</ViewGoto></li>
    <li><ViewGoto view='/issue/SPLPRJ-44'>SPLPRJ-44</ViewGoto></li>
  </div>
)

const CommentBox = (props) => (
  <div>
    <p>Issue {props.match.params.key}</p>
  </div>
)

render(
  <Root />,
  document.getElementById('root')
)
