'use strict'

const { story } = require('./env/index')
const { main: errors } = require('./stories/errors')
const { main: issue } = require('./stories/issue')

function runStory () {
  switch (story) {
    case 1:
      console.log('Running issue()...')
      return issue()
    case 0:
    default:
      console.log('Running errors()...')
      return errors()
  }
}

runStory()
