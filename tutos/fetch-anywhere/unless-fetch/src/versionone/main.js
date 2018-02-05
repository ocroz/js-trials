'use strict'

const { story } = require('./env/index')
const { main: errors } = require('./stories/errors')
const { main: info } = require('./stories/info')

function runStory () {
  switch (story) {
    case 1:
      console.log('Running info()...')
      return info()
    case 0:
    default:
      console.log('Running errors()...')
      return errors()
  }
}

runStory()
