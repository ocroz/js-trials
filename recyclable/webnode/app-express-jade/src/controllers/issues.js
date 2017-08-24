const apiJira = require('../fetches/apijira')
const { Router } = require('express')

const router = new Router()

router.get('/', listIssues)
router.post('/', createIssue)
router.get('/new', newIssue)
router.get('/:id', showIssue)
router.post('/:id', createComment)
router.get('/:id/new', newComment)
router.get('/:id/:cid', showComment)
router.put('/:id/:cid', updateComment)
router.delete('/:id/:cid', deleteComment)

module.exports = router

async function listIssues (req, res) {
  const issues = await apiJira.searchIssues()
  res.render('issue/index', { pageTitle: 'Issues', issues })
}

function createIssue (req, res) {
  console.log(req.body)
  res.redirect(`/issue`)
}

function newIssue (req, res) {
  res.redirect(`/issue`)
}

async function showIssue (req, res) {
  const issue = await apiJira.getIssue(req.params.id)
  res.render('issue/show', { pageTitle: req.params.id, issue })
}

async function createComment (req, res) {
  const { id } = req.params
  await apiJira.postComment(id, req.body)
  res.redirect(`/issue/${req.params.id}`)
}

function newComment (req, res) {
  const { id } = req.params
  const issue = { id }
  res.render('issue/comment/new', { pageTitle: 'New comment for issue ' + id, issue })
}

async function showComment (req, res) {
  const { id, cid } = req.params
  const comment = await apiJira.getComment(id, cid)
  res.render('issue/comment/update', { pageTitle: 'Issue ' + id + ' / Comment ' + cid, id, comment })
}

async function updateComment (req, res) {
  const { id, cid } = req.params
  await apiJira.putComment(id, cid, req.body)
  res.redirect(`/issue/${id}`)
}

async function deleteComment (req, res) {
  const { id, cid } = req.params
  await apiJira.deleteComment(id, cid)
  res.redirect(`/issue/${id}`)
}
