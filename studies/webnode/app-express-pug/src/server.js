'use strict'

require('colors')
// const apiJira = require('./fetches/apijira')
const { port } = require('./fetches/index')
const app = require('./app')
const { createServer } = require('http')

app.set('port', port)
const server = createServer(app)
server.listen(app.get('port'), () => {
  console.log('✔ Server listening on port'.green, String(app.get('port')).cyan)
})

// ;(async () => {
//   if (await apiJira.myself()) {
//     app.set('port', port)
//     const server = createServer(app)
//     server.listen(app.get('port'), () => {
//       console.log('✔ Server listening on port'.green, String(app.get('port')).cyan)
//     })
//   }
// })()
