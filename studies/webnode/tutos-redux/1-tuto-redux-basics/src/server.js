'use strict'
const express = require('express')
const Path = require('path')
require('colors')

const app = express()

// Server constants
app.set('port', process.env.PORT || 2000)

// Use pug engine with views under ./views
app.set('views', Path.resolve(__dirname, 'views'))
app.set('view engine', 'pug')

// Where to store the css and js files used on client side
app.use(express.static(Path.resolve(__dirname, '../public')))

// Send index.pug whenever the server is contacted
app.get('/test', (req, res) => res.render('test'))
app.get('/*', (req, res) => res.render('index'))

app.listen(app.get('port'), () => {
  console.log('✔ Server listening on port'.green, String(app.get('port')).cyan)
})
