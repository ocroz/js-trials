'use strict'

/* globals Component, render, BrowserRouter, Provider */
/* globals AppRoot, store */

class Root extends Component {
  render () {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <AppRoot />
        </BrowserRouter>
      </Provider>
    )
  }
}

render(
  <Root />,
  document.getElementById('root')
)
