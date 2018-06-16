'use strict'
const bodyParser = require('body-parser')
const express = require('express')
const methodOverride = require('method-override')
const Path = require('path')
require('colors')

const app = express()

// Server constants
app.set('port', process.env.PORT || 2000)
app.locals.jiraHost = process.env.JIRA_HOST || 'localhost'
app.locals.jiraPort = process.env.JIRA_PORT || 4545
app.locals.title = 'App Web Sockets'

// Use pug engine with views under ./views
app.set('views', Path.resolve(__dirname, 'views'))
app.set('view engine', 'pug')

// Where to store the css and js files used on client side
app.use(express.static(Path.resolve(__dirname, '../public')))

// Get the request body in either json or from the html forms as urlencoded extended
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// To use other methods such as delete on post from the html forms
app.use(methodOverride(req => req.body._method))

// Send index.html whenever the server is contacted
// app.get('/*', (req, res) => { res.sendFile(Path.resolve(__dirname, '../public') + '/index.html') })
app.get('/*', (req, res) => res.render('index'))

app.listen(app.get('port'), () => {
  console.log('✔ Server listening on port'.green, String(app.get('port')).cyan)
})
