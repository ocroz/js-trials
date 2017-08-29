'use strict'
const express = require('express')
const Path = require('path')
require('colors')

const app = express()

// Server constants
app.set('port', process.env.PORT || 2000)

// Where to store the css and js files used on client side
app.use(express.static(Path.resolve(__dirname, '../public')))

// Send index.html whenever the server is contacted
app.get('/*', (req, res) => { res.sendFile(Path.resolve(__dirname, '../public') + '/index.html') })

app.listen(app.get('port'), () => {
  console.log('✔ Server listening on port'.green, String(app.get('port')).cyan)
})
