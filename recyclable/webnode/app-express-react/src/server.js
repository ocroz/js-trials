'use strict'
const apiJira = require('./lib/apijira')
const bodyParser = require('body-parser')
const express = require('express')
const Path = require('path')
require('colors')

const app = express()

// Server constants
app.set('port', process.env.PORT || 2000)

// Where to store the css and js files used in jade views
app.use(express.static(Path.resolve(__dirname, '../public')))

// Get the POST body in either json or urlencoded extended
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Send home file on '/' and Send JIRA json result on '/jira'
app.get('/', (req, res) => { res.sendFile('../public/index.html') })
app.post('/jira', (req, res) => { reqJira(req, res) })

// Start the server only if the connection to JIRA functions
;(async () => {
  if (await apiJira.myself()) {
    app.listen(app.get('port'), () => {
      console.log('✔ Server listening on port'.green, String(app.get('port')).cyan)
    })
  }
})()

// Wrapper to any further JIRA request
async function reqJira (req, res) {
  console.log(req.body)
  const { method, request, body } = req.body
  const json = await apiJira.request(method, request, body)
  res.json(json)
}
