const express = require('express')
const Path = require('path')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const mainController = require('./controllers/main')
const issuesController = require('./controllers/issues')

const app = express()

app.locals.title = 'App Express Pug'

app.set('views', Path.resolve(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.static(Path.resolve(__dirname, '../public')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride(req => req.body._method))

app.use(mainController)
app.use('/issue', issuesController)

module.exports = app
