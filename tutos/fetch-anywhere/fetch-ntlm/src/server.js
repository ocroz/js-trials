'use strict'
require('colors')
const http = require('http')
const { trycatch, main } = require('./vone-calls')

const port = process.env.PORT || 7000

const server = http.createServer((req, res) => {
  if (req.url !== '/favicon.ico') {
    trycatch(main)
  }
  res.writeHead(200, {'Content-type': 'text/plan'})
  res.end()
})
server.listen(port, () => {
  console.log('✔ Server listening on port'.green, String(port).cyan)
})
