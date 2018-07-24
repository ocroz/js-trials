'use strict'

require('colors')
const { createServer } = require('http')
const { serverHost, serverPort, publicHost, publicPort } = require('./env/index')
const app = require('./app')
const { attachWebSockets } = require('./controllers/web-sockets')

app.set('host', serverHost)
app.set('port', serverPort)
const server = createServer(app)
attachWebSockets(server)
server.listen(app.get('port'), app.get('host'), () => {
  if (app.get('host') === publicHost && app.get('port') === publicPort) {
    console.log('✔ Server listening on port'.green, String(app.get('port')).cyan)
  } else {
    console.log(
      '✔ Server listening on internal port'.green, String(app.get('port')).cyan,
      'at PUBLIC_URL', String('http://' + publicHost + ':' + publicPort).cyan
    )
  }
})
