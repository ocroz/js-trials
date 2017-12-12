'use strict'

const { story } = require('./env/index')
const { main: calls } = require('./stories/calls')
const { main: errors } = require('./stories/errors')

function runStory () {
  switch (story) {
    case 1:
      console.log('Running calls()...')
      return calls()
    case 0:
    default:
      console.log('Running errors()...')
      return errors()
  }
}

runStory()
