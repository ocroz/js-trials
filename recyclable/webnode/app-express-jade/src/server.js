const apiJira = require('./fetches/apijira')
const app = require('./app')
const { createServer } = require('http')
require('colors')

;(async () => {
  if (await apiJira.myself()) {
    app.set('port', process.env.PORT || 4000)
    const server = createServer(app)
    server.listen(app.get('port'), () => {
      console.log('✔ Server listening on port'.green, String(app.get('port')).cyan)
    })
  }
})()
