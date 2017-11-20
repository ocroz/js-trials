# Step by step into express and pug

Steps:
- [server without express](#server-without-express)
- [server without express with routing](#add-some-routes-to-a-server-without-express)
- [server with express and param in req](#server-with-express)
- [html sendFile and redirect](#send-complete-html-file-and-redirect-to-fallback-page)
- [json get and post](#get-and-post-json-data)
- [pug forms and methods](#render-dynamic-html-pages-with-pug)
- [router info/ and table/](#forward-the-request-to-appropriate-controller)

## Server without express

Try it:

```bash
node src/server-basic.js
```

Usage: Serve a unique page on GET request.

Use the `http` module of `node.js`.

```javascript
var http = require('http')
var server = http.createServer(servePageFn)
server.listen(port, serverListeningFn)
```

Write the response in 'text/plain', or 'text/html', or etc.

```javascript
function servePageFn (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'})
  response.write('hello world')
  response.end()
}
```

## Add some routes to a server without express

Try it:

```bash
node src/server-basurl.js
```

Usage: Serve several pages faster than with express
(See [node.js http url routing using url.pathname](http://www.codexpedia.com/node-js/node-js-http-url-routing-using-url-pathname/)).

Use the `url` module of `node.js` too.

```javascript
var url = require('url')
function servePageFn (request, response) {
  var urlParts = url.parse(req.url)
  switch (urlParts.pathname) {
    case '/':
      ...
      break
    case '/info':
      ...
      break
    default:
      ...
      break
  }
}
```

## Server with express

Try it:

```bash
node src/server-hello.js
```

Usage: Simplify your code, natively handle different methods (not only GET requests), and much more.

Same example as above. The code is much simpler.

```javascript
var express = require('express')
var app = express()
app.get('/', getHomeFn)
app.get('/info', getInfoFn)
app.get('/*', getDefaultFn)
app.listen(port, serverListeningFn)
```

Let's get parameters from the url.

```javascript
app.get('/:item/:prop', getParams) // params are 'item' and 'prop'
function getParams (req, res) {
  res.send(`item="${req.params.item}", prop="${req.params.prop}".`) // they are available in 'req.params'
}
```

## Send complete html file and redirect to fallback page

Try it:

```bash
node src/server-html.js
```

Usage: Send static pages from separate html files.

```javascript
// Use 'path' from 'node.js'
var Path = require('path')

// Now use 'sendFile()'
app.get('/hello', getHello)
function getHello (req, res) {
  res.sendFile(Path.join(__dirname, 'html/hello.html'))
}
```

Also redirect to another fallback page.

```javascript
// Routes
app.get('/redirect', getRedirectFn)
app.get('/*', getDefaultFn)

// Fallback page where to redirect everything else
function getRedirectFn (req, res) {
  res.sendFile(Path.join(__dirname, 'html', 'redirect.html'))
}
function getDefaultFn (req, res) {
  res.redirect('/redirect')
}
```

### Special dedicace to the server root home

GET '/' will sendFile 'pathToPublicFiles/index.html' if:
- 'app.use(express.static(pathToPublicFiles))' is defined, and
- 'pathToPublicFiles/' includes a 'index.html' file.

```javascript
app.use(express.static(Path.resolve(__dirname, './html')))
app.get('/', getHomeFn) // This function is silently ignored.
```

GET '/' will call 'getHomeFn(req, res)' otherwise.

```javascript
// app.use(express.static(Path.resolve(__dirname, './html')))
app.get('/', getHomeFn) // This function is now called on GET '/'.
```

## GET and POST json data

Try it:

```bash
node src/server-json.js
```

Usage: Pull or Push data from/to server.

First sendFile 'client.html' on GET '/' from where to contact the server via the '/json' API.

```javascript
// 'client.html' needs to load 'client.js' from the public directory
// So let's define a public directory first.
app.use(express.static(Path.resolve(__dirname, './json')))

// Now sendFile 'client.html' on GET '/'
app.get('/', getClientFn)
function getClientFn (req, res) {
  res.sendFile(Path.join(__dirname, 'json/client.html'))
}
```

The client files.

client.html:
```html
  <script src="/client.js"></script>
  <button onclick="getJson()">GET</button>
  <button onclick="getJson('POST', {nb: 3})">POST</button> <!-- POST {nb:3} -->
```

client.js:
```javascript
fetch('/json', {method: 'GET'})
fetch('/json', {method: 'POST', body: '{nb:3}'})
```

Back to the server files.

Let's implement the '/json' API for the GET and POST methods.

Simply send some json data on GET.

```javascript
app.get('/json', getJsonFn)
function getJsonFn (req, res) {
  res.json({ message: 'hooray! welcome to our api!' })
}
```

First parse the json data sent by the client on POST.

```javascript
// Add a bodyParser to get the json data from the request body on POST
var bodyParser = require('body-parser')
app.use(bodyParser.json())

// Then process the received json data on POST with 'app.post'
app.post('/json', postJsonFn)
function postJsonFn (req, res) {
  res.json({ result: `You posted nb=${req.body.nb}.` })
}
```

## Render dynamic html pages with pug

Try it:

```bash
node src/server-pug.js
```

Usage: Adapt the html content before to send it to the client.

First write dynamic html using pug templates.
See the pug syntax at [pugjs](https://github.com/pugjs/pug).

Example: [src/views/table.pug](src/views/table.pug).

```
if table.length === 0
  p There's nothing to display yet.
else
  p Here's the table.
```

Back to the server files.

Render the pug template and send it back to the client on GET '/table'.

```javascript
// Configure express to use pug engine with views under ./views
app.set('views', Path.resolve(__dirname, 'views'))
app.set('view engine', 'pug')

// Then render the pug templates on recieved requests
app.get('/table', getTableFn)
var table = []
function getTableFn (req, res) {
  res.render('table', { table }) // render ./views/table.pug with param table
}
```

### How to enhance a html form for other methods such as PUT, DELETE, etc.?

In the pug view, add a hidden input into the html form.

```
form(method="post" action="/table") // We use the html form to POST data
  input(type="hidden" name="_method" value="delete") // But we want to DELETE data
```

In the server file, use the `method-override` middleware.

```javascript
// To use other methods such as delete on post
var methodOverride = require('method-override')
app.use(methodOverride(req => req.body._method))

// Then process the received post like it was a DELETE with 'app.delete'
app.delete('/table', deleteTableFn})
function deleteTableFn (req, res) {
  table = []
  res.redirect('/table')
}
```

### How to reuse a shared layout on every page with pug?

Example: [src/views/home.pug](src/views/home.pug).

```
extend ./_layout
block content
  div(class='line-feed') <a href="/">home</a> &gt; <a href="/table">table</a>
  p This is the specific page.
```

The specific 'home.pug' extends the generic '_layout.pug', then use a css class named 'line-feed'. Where is it defined?

See the other generic [src/views/home.pug](src/views/_layout.pug):

```
html(lang="fr")
  head
    link(rel="stylesheet" href="/app.css")
  body
    block content
    script(src="/app.js")
```

Indeed the css is defined into '/app.css' which is located within the public directory which we introduced in the previous step to express.

We also see that '_layout.pug' loads '/app.js' which does a 'console.log()'. Open the console (F12) to see it.

## Forward the request to appropriate controller

Try it:

```bash
node src/server-router.js
```

Usage: Handle different subroutes in different javascript files aka controllers.

Don't write all your routes in a single javascript file. Use a router instead.

```javascript
// First import your subcontrollers
var infoRoutes = require('./routes/info')
var tableRoutes = require('./routes/table')

// Then load them into express
app.use('/info', infoRoutes)
app.use('/table', tableRoutes)
```

Define the subroutes in the appropriate file.

```javascript
// Create a local express router
const { Router } = require('express')
const router = new Router()

// Define the routes
router.get('/', getTable)
router.post('/', postTable)
router.delete('/', deleteTable)

// Export the controller
module.exports = router

// Then implement the functions
```
