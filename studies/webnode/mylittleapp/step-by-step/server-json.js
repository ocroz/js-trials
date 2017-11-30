require('colors')
const express = require('express')
const { createServer } = require('http')
const Path = require('path')
const bodyParser = require('body-parser')

const app = express()

// Server constants
app.set('port', process.env.PORT || 4000)
app.locals.title = 'My Little App'

// Use jade engine with views under ./views
app.set('views', Path.resolve(__dirname, 'views'))
app.set('view engine', 'jade')

// Where to store the css and js files used in jade views
app.use(express.static(Path.resolve(__dirname, './public')))

// To get the data from the html forms
app.use(bodyParser.urlencoded({ extended: true }))

// Load client.js (via client.jade) on / and Return json on /json
const router = new express.Router()
router.get('/', (req, res) => res.render('client')) // render ./views/client.jade
router.get('/json', (req, res) => res.json({ message: 'hooray! welcome to our api!' }))
app.use(router)

const server = createServer(app)
server.listen(app.get('port'), () => {
  console.log('✔ Server listening on port'.green, String(app.get('port')).cyan)
})
