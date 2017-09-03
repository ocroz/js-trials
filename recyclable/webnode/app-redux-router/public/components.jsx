'use strict'
/* global React ReactDOM */
const { BrowserRouter, Route, Link, Switch, Redirect } = window.ReactRouterDOM
const { Provider, connect } = window.ReactRedux
const { combineReducers, createStore } = window.Redux

//
// Redux part - Logic
//

// Reducer view
const view = (state = 'home', action) => {
  switch (action.type) {
    case 'SET_VIEW':
      return action.view
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

// Render the initial view
store.dispatch(setView(document.getElementById('originalUrl').value))

//
// React part - UI
//
class Root extends React.Component {
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
      <Route path='/search' component={IssueBox} />
      <Route path='/issue/:key' component={CommentBox} />
      {/* <Route path='/issue' component={IssueSwitch} /> */}
      <Redirect from='/issue' to='/search' />
      <Redirect to='/' />
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

/*
const IssueSwitch = () => (
  <div>
    <Switch>
      <Route exact path='/issue' component={NoIssueSelected} />
      <Route path='/issue/:key' component={CommentBox} />
    </Switch>
  </div>
)

const NoIssueSelected = () => (
  <div>
    <p>No Issue Selected</p>
    <ViewGoto view='/search'>
      back
    </ViewGoto>
  </div>
)
*/

const CommentBox = (props) => (
  <div>
    <p>Issue {props.match.params.key}</p>
  </div>
)

ReactDOM.render(
  <Root />, document.getElementById('root')
)
