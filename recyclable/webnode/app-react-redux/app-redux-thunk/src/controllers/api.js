'use strict'
const { Router } = require('express')

const router = new Router()

router.get('/', getItems)
router.post('/', postItems)
router.put('/:key', putItems)
router.delete('/:key', deleteItems)

module.exports = router

let items = {
  items: [
    {key: 'SPLPRJ-42'},
    {key: 'SPLPRJ-43'},
    {key: 'SPLPRJ-44'}
  ]
}

function getItems (req, res) {
  console.log('get /api')
  res.json(items)
}

function postItems (req, res) {
  console.log(req.body)
  res.json({ status: 200, ok: true, statusText: 'OK' })
}

function putItems (req, res) {
  const { key } = req.params
  console.log(key, req.body)
  res.json({ status: 200, ok: true, statusText: 'OK' })
}

function deleteItems (req, res) {
  const { key } = req.params
  console.log(key)
  res.json({ status: 200, ok: true, statusText: 'OK' })
}
