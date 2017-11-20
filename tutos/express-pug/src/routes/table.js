const { Router } = require('express')

const router = new Router()

router.get('/', getTable)
router.post('/', postTable)
router.delete('/', deleteTable)

module.exports = router

// methods get, post, delete
let table = []

function getTable (req, res) {
  res.render('table', { table }) // render ./views/table.pug with param table
}

function postTable (req, res) {
  createTable(req)
  res.redirect('/table')
}

function deleteTable (req, res) {
  table = []
  res.redirect('/table')
}

function createTable ({ body }) {
  table = []
  const number = parseInt(body.number)
  const count = parseInt(body.count)
  for (let i = 1; i <= count; ++i) {
    table.push(`${number} * ${i} = ${number * i}`)
  }
}
