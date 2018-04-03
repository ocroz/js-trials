'use strict'

const express = require('express')
const serveIndex = require('serve-index')
const Path = require('path')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const routes = require('./routes')

const app = express()

app.locals.title = 'App Mock Jira'

app.set('views', Path.resolve(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/jcic1/download/:file', (req, res) => {
  res.redirect('/custom/jcic/1/examples/download/' + req.params.file)
})
app.get('/custom/jcic/1/examples/download/:file', (req, res) => {
  console.log('download', req.originalUrl)
  const headers = {
    'Content-Disposition': 'attachment; filename=' + req.params.file,
    'Content-Type': 'application/octet-stream'
  }
  res.sendFile(Path.resolve(__dirname, '../public' + req.originalUrl), {headers})
})

app.use(express.static(Path.resolve(__dirname, '../public')))

app.use(
  '/jcic1',
  express.static(Path.resolve(__dirname, '../public/custom/jcic/1/examples')),
  serveIndex(Path.resolve(__dirname, '../public/custom/jcic/1/examples'), {'icons': true})
)

app.use(
  '/jcic2',
  express.static(Path.resolve(__dirname, '../public/custom/jcic/2/examples')),
  serveIndex(Path.resolve(__dirname, '../public/custom/jcic/2/examples'), {'icons': true})
)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride(req => req.body._method))

app.use(routes)

module.exports = app
