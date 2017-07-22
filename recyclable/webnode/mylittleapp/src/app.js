const express = require('express')
const Path = require('path')

const mainController = require('./controllers/main')
const issuesController = require('./controllers/issues')

const app = express()

app.locals.title = 'My Little App'

app.set('views', Path.resolve(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(express.static(Path.resolve(__dirname, '../public')))

app.use(mainController)
app.use('/issue', issuesController)

module.exports = app
