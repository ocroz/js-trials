const { createStore, applyMiddleware } = window.Redux
const createLogger = window.reduxLogger
const thunkMiddleware = window.ReduxThunk.default

/* global app */

// Create the store
const preloadedState = undefined
const loggerMiddleware = createLogger()
let store = createStore( // eslint-disable-line no-unused-vars
  app,
  preloadedState,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
)
