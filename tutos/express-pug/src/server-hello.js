'use strict'
require('colors')
const express = require('express')
const app = express()

app.set('port', process.env.PORT || 4000)

app.get('/', (req, res) => { res.send('go to <a href="/hello">hello</a>, <a href="/now">now</a>, <a href="/data">data</a>.') })
app.get('/hello', (req, res) => { res.send('hello world') })
app.get('/now', (req, res) => { res.send(new Date().toString()) })
app.get('/:id', (req, res) => res.send(`processing "/${req.params.id}" ...<br>back to <a href="/">home</a>`))

app.listen(app.get('port'), () => {
  console.log('✔ Server listening on port'.green, String(app.get('port')).cyan)
})
