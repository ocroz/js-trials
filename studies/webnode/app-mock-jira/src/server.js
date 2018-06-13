'use strict'

require('colors')
const { createServer } = require('http')
const { serverHost, serverPort } = require('./env/index')
const app = require('./app')
const { attachWebSockets } = require('./controllers/web-sockets')

app.set('host', serverHost)
app.set('port', serverPort)
const server = createServer(app)
attachWebSockets(server)
server.listen(app.get('port'), app.get('host'), () => {
  console.log('✔ Server listening on port'.green, String(app.get('port')).cyan)
})
