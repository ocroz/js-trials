require('colors')
const express = require('express')
const { createServer } = require('http')
const Path = require('path')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

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

// To use other methods such as delete on post
app.use(methodOverride((req) => req.body._method))

// Add a post and a delete
const router = new express.Router()
let table = []
router.get('/', (req, res) => res.render('table', { table })) // render ./views/table.jade with param table
router.post('/', (req, res) => { createTable(req); res.redirect('/') })
router.delete('/', (req, res) => { table = []; res.redirect('/') })
app.use(router)

const server = createServer(app)
server.listen(app.get('port'), () => {
  console.log('✔ Server listening on port'.green, String(app.get('port')).cyan)
})

function createTable ({ body }) {
  table = []
  const number = parseInt(body.number)
  const count = parseInt(body.count)
  for (let i = 1; i <= count; ++i) {
    table.push(`${number} * ${i} = ${number * i}`)
  }
}
