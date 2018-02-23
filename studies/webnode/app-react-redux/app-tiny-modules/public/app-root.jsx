'use strict'

/* globals Switch, Route, Redirect */
/* globals LinkView, IssueBox, IssuesBox, PlanBox */
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
        <LinkView view='/issues'>
          Issues
        </LinkView>
        {matches !== null &&
          <span>
            {', '}
            <LinkView view={matches[0]}>
              {matches[1]}
            </LinkView>
          </span>
        }
        {', '}
        <LinkView view='/plan'>
          Plan
        </LinkView>
      </div>
    </div>
  )
}

const Main = () => (
  <div>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/issues' component={IssuesBox} />
      <Route path='/issue/:key' component={IssueBox} />
      <Route exact path='/plan' component={PlanBox} />
      <Redirect to={store.getState().view} />
    </Switch>
  </div>
)

const Home = () => (
  <div className='container'>
    <p>Home</p>
  </div>
)
