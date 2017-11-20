'use strict'
require('colors')
const bodyParser = require('body-parser')
const express = require('express')
const { createServer } = require('http')
const methodOverride = require('method-override')
const Path = require('path')

const infoRoutes = require('./routes/info')
const tableRoutes = require('./routes/table')

const app = express()

// Server constants
app.set('port', process.env.PORT || 4000)
app.locals.title = 'App Express with Routes' // locals passed to pug

// Use pug engine with views under ./views
app.set('views', Path.resolve(__dirname, 'views'))
app.set('view engine', 'pug')

// Where to store the css and js files used in pug views
app.use(express.static(Path.resolve(__dirname, './public')))

// To get the request body in json and the data from the html forms
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// To use other methods such as delete on post
app.use(methodOverride(req => req.body._method))

// Render 'routes.pug' or redirect to subroute controllers with 'app.use'
app.get('/', (req, res) => res.render('routes'))
app.use('/info', infoRoutes)
app.use('/table', tableRoutes)

// Start the server
const server = createServer(app)
server.listen(app.get('port'), () => {
  console.log('✔ Server listening on port'.green, String(app.get('port')).cyan)
})
