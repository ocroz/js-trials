'use strict'

const { Router } = require('express')

const apiController = require('./controllers/api')
const agileController = require('./controllers/agile')
const browseController = require('./controllers/browse')

const baseUrl = '/jira'
const router = new Router()

router.get('/', (req, res) => res.redirect(baseUrl))
router.get(baseUrl + '/', (req, res) => res.render('home'))
router.use(baseUrl + '/browse', browseController)
router.use(baseUrl + '/rest/api/2', apiController)
router.use(baseUrl + '/rest/agile/1.0', agileController)
router.get('/custom/lib/*', (req, res) => res.redirect(req.originalUrl.replace('/custom/lib', '/lib')))

module.exports = router
