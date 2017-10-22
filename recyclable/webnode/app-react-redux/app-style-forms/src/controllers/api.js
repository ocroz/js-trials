'use strict'
const { Router } = require('express')

const router = new Router()

router.get('/', getIssues)
router.post('/', postIssue)
router.get('/fake', getFake)
router.post('/:key/comment', postComment)
router.put('/:key/comment/:id', putComment)
router.delete('/:key/comment/:id', deleteComment)
router.put('/:key', putIssue)
router.delete('/:key', deleteIssue)

module.exports = router

function getFake (req, res) {
  console.log('get /api/fake')

  // > For testing
  const [project, issuetype, reporter, assignee, summary, description] =
    ['SPLPRJ', 'Task', 'crozier', 'crozier', 'An issue', 'A description']
  addIssue({project, issuetype, reporter, assignee, summary, description})
  // < For testing

  setTimeout(() => res.json({ status: 200, ok: true, statusText: 'OK' }), 200)
}

function getIssues (req, res) {
  console.log('get /api')
  const data = { issues: issues.filter(issue => issue.active) }
  data.issues.forEach((issue, i) => {
    data.issues[i].fields.comment.comments =
      data.issues[i].fields.comment.comments
      .filter(comment => comment.active)
  })
  setTimeout(() => res.json(data), 200) // Simulate a long server processing
}

function postIssue (req, res) {
  console.log('post /api', req.body)
  const project = req.body.fields.project.key
  const issuetype = req.body.fields.issuetype.name
  const reporter = req.body.fields.reporter.name
  const assignee = req.body.fields.assignee.name
  const {summary, description} = req.body.fields
  addIssue({project, issuetype, reporter, assignee, summary, description})
  res.json({ status: 200, ok: true, statusText: 'OK' })
}

function putIssue (req, res) {
  const { key } = req.params
  console.log(key, req.body)
  res.json({ status: 200, ok: true, statusText: 'OK' })
}

function deleteIssue (req, res) {
  const { key } = req.params
  const issueIndex = issues.findIndex(issue => issue.key === key)
  console.log(`Delete issue ${key} (issueIndex: ${issueIndex})`)
  issues[issueIndex].active = false
  res.json({ status: 200, ok: true, statusText: 'OK' })
}

function postComment (req, res) {
  const { key } = req.params
  console.log(`post /api/${key}/comment`, req.body)
  const issueIndex = issues.findIndex(issue => issue.key === key)
  const active = true
  const id = issues[issueIndex].fields.comment.comments.length
  const author = { name: 'crozier' }
  const { body } = req.body
  const created = new Date()
  const comment = { active, id, author, body, created }
  issues[issueIndex].fields.comment.comments.push(comment)
  res.json({ status: 200, ok: true, statusText: 'OK' })
}

function putComment (req, res) {
  const { key } = req.params
  console.log(key, req.body)
  res.json({ status: 200, ok: true, statusText: 'OK' })
}

function deleteComment (req, res) {
  const { key, id } = req.params
  const issueIndex = issues.findIndex(issue => issue.key === key)
  console.log(`Delete comment ${id} of issue ${key} (issueIndex: ${issueIndex})`)
  issues[issueIndex].fields.comment.comments[id].active = false
  res.json({ status: 200, ok: true, statusText: 'OK' })
}

let issues = []
function addIssue ({project, issuetype, reporter, assignee, summary, description}) {
  const active = true
  const status = 'Open'
  const projectkey = 'SPLPRJ'
  const key = `${projectkey}-${issues.length + 1}`
  const fields = {
    project: { key: projectkey },
    issuetype: { name: issuetype },
    reporter: { name: reporter },
    assignee: { name: assignee },
    status: { name: status },
    summary,
    description,
    comment: { comments: [] }
  }
  const issue = { key, active, fields }
  issues.push(issue)
}
