const { createServer } = require('http')
const app = require('./app')
require('colors')

app.set('port', process.env.PORT || 4000)

const server = createServer(app)
server.listen(app.get('port'), () => {
  console.log('✔ Server listening on port'.green, String(app.get('port')).cyan)
})
