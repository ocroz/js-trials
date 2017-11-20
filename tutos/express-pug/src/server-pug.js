'use strict'
require('colors')
const express = require('express')
const Path = require('path')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const app = express()

// Server constants
app.set('port', process.env.PORT || 4000)
app.locals.title = 'App Express with Pug and Forms' // locals passed to pug

// Use pug engine with views under ./views
app.set('views', Path.resolve(__dirname, 'views'))
app.set('view engine', 'pug')

// Where to store the css and js files used in pug views
app.use(express.static(Path.resolve(__dirname, './public')))

// To get the data from the html forms
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json()) // Or if to get the request body in json

// To use other methods such as delete on post
app.use(methodOverride(req => req.body._method))

// methods get, post, delete
let table = []
app.get('/', (req, res) => res.render('home')) // render ./views/home.pug
app.get('/table', (req, res) => res.render('table', { table })) // render ./views/table.pug with param table
app.post('/table', (req, res) => { createTable(req); res.redirect('/table') })
app.delete('/table', (req, res) => { table = []; res.redirect('/table') })

app.listen(app.get('port'), () => {
  console.log('✔ Server listening on port'.green, String(app.get('port')).cyan)
})

function createTable ({ body }) {
  table = []
  const number = parseInt(body.number)
  const count = parseInt(body.count)
  for (let i = 1; i <= count; ++i) {
    table.push(`${number} * ${i} = ${number * i}`)
  }
}
