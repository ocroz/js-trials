'use strict'

require('colors')
const { createServer } = require('http')
const { port } = require('./env/index')
const app = require('./app')

app.set('port', port)
const server = createServer(app)
server.listen(app.get('port'), () => {
  console.log('✔ Server listening on port'.green, String(app.get('port')).cyan)
})
