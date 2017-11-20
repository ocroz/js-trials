'use strict'
const http = require('http')

const port = process.env.PORT || 4000

http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'})
  response.write('<!DOCTYPE html>')
  response.write('<html>')
  response.write('<head>')
  response.write('<title>Basic Server</title>')
  response.write('</head>')
  response.write('<body>')
  response.write(new Date().toString())
  response.write('</body>')
  response.write('</html>')
  response.end()
}).listen(port, function () {
  console.log(`Server running at http://localhost:${port}`)
})
