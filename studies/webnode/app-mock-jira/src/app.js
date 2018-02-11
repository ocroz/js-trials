const express = require('express')
const Path = require('path')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const routes = require('./routes')

const app = express()

app.locals.title = 'App Mock Jira'

app.set('views', Path.resolve(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.static(Path.resolve(__dirname, '../public')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride(req => req.body._method))

app.use(routes)

module.exports = app
