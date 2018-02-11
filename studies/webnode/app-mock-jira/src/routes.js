const { Router } = require('express')

const apiController = require('./controllers/api')
const browseController = require('./controllers/browse')

const baseUrl = '/jira'
const router = new Router()

router.get('/', (req, res) => res.redirect(baseUrl))
router.get(baseUrl + '/', (req, res) => res.render('home'))
router.use(baseUrl + '/browse', browseController)
router.use(baseUrl + '/rest/api/2', apiController)

module.exports = router
