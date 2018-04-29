'use strict'

/* globals createStore, applyMiddleware, createLogger, thunkMiddleware */

/* globals appDefaultState, appReducers */

// Create the store
const loggerMiddleware = createLogger()
let store = createStore( // eslint-disable-line no-unused-vars
  appReducers,
  appDefaultState,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
)
