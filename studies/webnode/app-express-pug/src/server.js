'use strict'

require('colors')
const { createServer } = require('http')
const { port } = require('./fetches/index')
const app = require('./app')
// const apiJira = require('./fetches/apijira')

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
