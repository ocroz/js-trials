'use strict'
const moment = require('moment')
const { Router } = require('express')
const { getIssue } = require('../model/issues')

const router = new Router()

router.get('/:key', renderIssue)

module.exports = router

function renderIssue (req, res) {
  console.log('get', req.originalUrl)
  const issue = getIssue(req.params.key)
  res.render('issue', { issue, moment })
}
