'use strict'
require('colors')
const bodyParser = require('body-parser')
const express = require('express')
const Path = require('path')

const app = express()

app.set('port', process.env.PORT || 4000)

// Where to store the css and js files used in html files
app.use(express.static(Path.resolve(__dirname, './json')))

// To get the request body in json
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true })) // Or if to get the data from the html forms

// Load client.js (via client.html) on / and Return json on /json
app.get('/', (req, res) => res.sendFile(Path.join(__dirname, 'json/client.html')))
app.get('/json', (req, res) => res.json({ message: 'hooray! welcome to our api!' }))
app.post('/json', (req, res) => res.json({ result: `You posted nb=${req.body.nb}.` }))

app.listen(app.get('port'), () => {
  console.log('✔ Server listening on port'.green, String(app.get('port')).cyan)
})
