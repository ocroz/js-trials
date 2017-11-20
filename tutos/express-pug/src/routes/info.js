const { Router } = require('express')

const router = new Router()

router.get('/', getInfoFn)
router.get('/hello', getHelloFn)
router.get('/now', getNowFn)
router.get('/:item/:prop', getItemPropFn)

module.exports = router

function getInfoFn (req, res) {
  res.send('go to <a href="/info/hello">hello</a>, <a href="/info/now">now</a>, <a href="/info/shark/tooth">sharktooth</a>.')
}

function getHelloFn (req, res) {
  res.send('hello world')
}

function getNowFn (req, res) {
  res.send(new Date().toString())
}

function getItemPropFn (req, res) {
  res.send(`item="${req.params.item}", prop="${req.params.prop}".`)
}
