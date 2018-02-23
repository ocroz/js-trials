'use strict'

const { Router } = require('express')

const { rankIssues } = require('../model/issues')

const router = new Router()

router.put('/issue/rank', _putRank)

module.exports = router

function _putRank (req, res) {
  console.log('put', req.originalUrl, req.body)
  rankIssues(req.body)
  res.end()
}
