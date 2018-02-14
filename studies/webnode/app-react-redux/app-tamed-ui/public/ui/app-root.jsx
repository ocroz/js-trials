'use strict'

/* globals Switch, Route, Redirect */
/* globals LinkView, IssueBox, IssuesBox */
/* globals store */

/* ******************** AppRoot, Header, Main, Home ******************** */

const AppRoot = () => ( // eslint-disable-line no-unused-vars
  <div>
    <Header />
    <Main />
  </div>
)

const Header = () => {
  const matches = store.getState().view.match('/issue/([^/]*)')
  return (
    <div className='container'>
      <div className='page-header'>
        Goto:
        {' '}
        <LinkView view='/'>
          Home
        </LinkView>
        {', '}
        <LinkView view='/search'>
          Search
        </LinkView>
        {matches !== null &&
          <span>
            {', '}
            <LinkView view={matches[0]}>
              {matches[1]}
            </LinkView>
          </span>
        }
      </div>
    </div>
  )
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
  <div className='container'>
    <p>Home</p>
  </div>
)
