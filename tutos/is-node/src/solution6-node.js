require('colors')
const http = require('http')
const { isNode, isBrowser } = require('./lib/index')

const port = process.env.PORT || 7000

function testIsNode () {
  if (isBrowser()) {
    return 'Running under browser'
  } else if (isNode()) {
    return 'Running under node.js'
  } else {
    throw new Error('Unknown running context')
  }
}
console.log(testIsNode())

const server = http.createServer((request, response) => {
  response.writeHead(200, {'Content-type': 'text/plan'})
  response.write('The server is ' + testIsNode())
  response.end()
})
server.listen(port, () => {
  console.log('✔ Server listening on port'.green, String(port).cyan)
})
