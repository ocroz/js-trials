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

const defaultIssue = {
  summary: 'this issue',
  comments: [
    { id: 1, body: 'first comment', author: 'crozier' },
    { id: 2, body: 'second comment', author: 'crozier' }
  ]
}

function listIssues (req, res) {
  // Get 3 issues and show them
  res.render('issue/index', { pageTitle: 'Methods' })
}

function createIssue (req, res) {

}

function newIssue (req, res) {

}

function showIssue (req, res) {
  // Get and show the issue fields and its comments
  const issue = Object.assign(defaultIssue, { id: req.params.id })
  res.render('issue/show', { pageTitle: issue.id, issue })
}

async function createComment (req, res) {
  // Save the comment and show the issue again
  console.log(req.body)
  res.redirect(`/issue/${req.params.id}`)
}

function newComment (req, res) {
  const { id, cid } = req.params
  const issue = { id }
  const comment = { cid }
  res.render('issue/comment/new', { pageTitle: 'New comment for issue ' + id, issue, comment })
}

function showComment (req, res) {
  const { id, cid } = req.params
  const commentMap = new Map()
  for (const comment of defaultIssue.comments) {
    commentMap.set(comment.id.toString(), comment)
  }
  const issue = { id }
  const comment = commentMap.get(cid.toString())
  res.render('issue/comment/show', { pageTitle: 'Issue ' + id + ' / Comment ' + cid, issue, comment })
}

function updateComment (req, res) {

}

function deleteComment (req, res) {

}
