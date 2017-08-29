'use strict'
/* global React ReactDOM */
const { MemoryRouter, BrowserRouter, Route, Link, Prompt, Switch, Redirect } = window.ReactRouterDOM // eslint-disable-line no-unused-vars

class Root extends React.Component {
  render () {
    return (
      <BrowserRouter>
        <App />
      </BrowserRouter>
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
  <header>
    <nav>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/search'>Search</Link></li>
        <li><Link to='/issue'>Issue</Link></li>
      </ul>
    </nav>
  </header>
)

const Main = () => (
  <div>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/search' component={IssueBox} />
      <Route path='/issue' component={IssueSwitch} />
    </Switch>
  </div>
)

// The original value keeps reachable until React updates the DOM at the next user click
document.getElementById('redirectUrl').value = '/'
const Home = () => (
  <div>
    <Redirect to={document.getElementById('redirectUrl').value} />
    <p>Home</p>
  </div>
)

const IssueBox = () => (
  <div>
    <p>Search</p>
    <li><Link to='/issue/SPLPRJ-42'>SPLPRJ-42</Link></li>
    <li><Link to='/issue/SPLPRJ-43'>SPLPRJ-43</Link></li>
    <li><Link to='/issue/SPLPRJ-44'>SPLPRJ-44</Link></li>
  </div>
)

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
    <p><Link to='/search'>back</Link></p>
  </div>
)

const CommentBox = (props) => (
  <div>
    <p>Issue {props.match.params.key}</p>
  </div>
)

ReactDOM.render(
  <Root />, document.getElementById('root')
)
