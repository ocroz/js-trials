// http://www.codexpedia.com/node-js/node-js-http-url-routing-using-url-pathname/
'use strict'
require('colors')
const http = require('http')
const url = require('url')

const port = process.env.PORT || 4000

http.createServer(function (req, res) {
  const urlParts = url.parse(req.url)
  switch (urlParts.pathname) {
    case '/':
      home(req, res)
      break
    case '/hello':
      hello(req, res)
      break
    default:
      redirect(req, res)
      break
  }
}).listen(port, function () {
  console.log('✔ Server listening on port'.green, `${port}`.cyan)
})

// functions to process incoming requests
function home (req, res) {
  res.end('<p>go to <a href="/hello">hello</a>, <a href="/data">data</a>.</p>')
}

function hello (req, res) {
  res.end('hello world')
}

function redirect (req, res) {
  res.end('You have been redirected here')
}
