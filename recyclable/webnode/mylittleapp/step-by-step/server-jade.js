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

// Add a post
const router = new express.Router()
router.get('/', (req, res) => res.send('go to <a href="/data">data</a> or <a href="/post">post</a>'))
router.get('/post', (req, res) => res.render('post')) // render ./views/post.jade
router.post('/post', (req, res) => res.send(`received ${JSON.stringify(req.body)}<br>back to <a href="/">home</a>`))
router.get('/:id', (req, res) => res.send(`processing ${req.params.id}<br>back to <a href="/">home</a>`))
app.use(router)

const server = createServer(app)
server.listen(app.get('port'), () => {
  console.log('✔ Server listening on port'.green, String(app.get('port')).cyan)
})
