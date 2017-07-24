require('colors')
const express = require('express')
const { createServer } = require('http')

const app = express()

app.set('port', process.env.PORT || 4000)
app.locals.title = 'My Little App'

const router = new express.Router()
router.get('/', (req, res) => res.send('go to <a href="/data">data</a>'))
router.get('/:id', (req, res) => res.send(`processing ${req.params.id}<br>back to <a href="/">home</a>`))
app.use(router)

const server = createServer(app)
server.listen(app.get('port'), () => {
  console.log('✔ Server listening on port'.green, String(app.get('port')).cyan)
})
