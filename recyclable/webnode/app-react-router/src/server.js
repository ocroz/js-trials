'use strict'
const express = require('express')
const Path = require('path')
require('colors')

const app = express()

// Server constants
app.set('port', process.env.PORT || 2000)

// Use jade engine with views under ./views
app.set('views', Path.resolve(__dirname, 'views'))
app.set('view engine', 'jade')

// Where to store the css and js files used in jade views
app.use(express.static(Path.resolve(__dirname, '../public')))

// Render index.jade whenever the server is contacted
app.get('/*', (req, res) => { res.render('index.jade', { url: req.originalUrl }) })

app.listen(app.get('port'), () => {
  console.log('✔ Server listening on port'.green, String(app.get('port')).cyan)
})
