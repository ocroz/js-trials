'use strict'
require('colors')
const express = require('express')
const Path = require('path')

const app = express()

app.set('port', process.env.PORT || 4000)

// Activate this line will override the below app.get('/') with 'html/index.html'
// app.use(express.static(Path.resolve(__dirname, './html')))

app.get('/', (req, res) => { res.send('<p>SEND: go to <a href="/hello">hello</a>, <a href="/data">data</a>.</p>') })
app.get('/hello', (req, res) => { res.sendFile(Path.join(__dirname, 'html/hello.html')) })
app.get('/redirect', (req, res) => { res.sendFile(Path.join(__dirname, 'html', 'redirect.html')) })
app.get('/*', (req, res) => res.redirect('/redirect'))

app.listen(app.get('port'), () => {
  console.log('✔ Server listening on port'.green, String(app.get('port')).cyan)
})
