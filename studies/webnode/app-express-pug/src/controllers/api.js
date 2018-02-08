'use strict'
const { Router } = require('express')

const router = new Router()

router.get('/myself', myself)
router.get('/search', getIssues)
router.post('/issue', postIssue)
router.get('/issue/fake', addFake)
router.get('/issue/:key', getIssue)
router.post('/issue/:key/comment', postComment)
router.get('/issue/:key/comment/:id', getComment)
router.put('/issue/:key/comment/:id', putComment)
router.delete('/issue/:key/comment/:id', deleteComment)
router.put('/issue/:key', putIssue)
router.delete('/issue/:key', deleteIssue)

module.exports = router

function myself (req, res) {
  console.log('get', req.originalUrl)
  const data = { name: 'crozier' }
  setTimeout(() => res.json(data), 200) // Simulate a long server processing
}

function addFake (req, res) {
  console.log('get', req.originalUrl)

  // > For testing
  const [project, issuetype, reporter, assignee, summary, description] =
    ['SPLPRJ', 'Task', 'crozier', 'crozier', 'An issue', 'A description']
  addIssue({project, issuetype, reporter, assignee, summary, description})
  // < For testing

  setTimeout(() => res.json({ status: 200, ok: true, statusText: 'OK' }), 200)
}

function getIssue (req, res) {
  console.log('get', req.originalUrl)
  const { key } = req.params
  const issueIndex = issues.findIndex(issue => issue.key === key)
  const data = issues[issueIndex]
  data.fields.comment.comments = data.fields.comment.comments.filter(comment => comment.active)
  setTimeout(() => res.json(data), 200) // Simulate a long server processing
}

function getIssues (req, res) {
  console.log('get', req.originalUrl)
  const data = { issues: issues.filter(issue => issue.active) }
  data.issues.forEach((issue, i) => {
    data.issues[i].fields.comment.comments =
      data.issues[i].fields.comment.comments
      .filter(comment => comment.active)
  })
  setTimeout(() => res.json(data), 200) // Simulate a long server processing
}

function postIssue (req, res) {
  console.log('post', req.originalUrl, req.body)
  const project = req.body.fields.project.key
  const issuetype = req.body.fields.issuetype.name
  const reporter = req.body.fields.reporter.name
  const assignee = req.body.fields.assignee.name
  const {summary, description} = req.body.fields
  addIssue({project, issuetype, reporter, assignee, summary, description})
  res.json({ status: 200, ok: true, statusText: 'OK' })
}

function putIssue (req, res) {
  console.log('put', req.originalUrl, req.body)
  // const { key } = req.params
  res.json({ status: 200, ok: true, statusText: 'OK' })
}

function deleteIssue (req, res) {
  console.log('delete', req.originalUrl)
  const { key } = req.params
  const issueIndex = issues.findIndex(issue => issue.key === key)
  console.log(`Delete issue ${key} (issueIndex: ${issueIndex})`)
  issues[issueIndex].active = false
  res.json({ status: 200, ok: true, statusText: 'OK' })
}

function postComment (req, res) {
  console.log('post', req.originalUrl, req.body)
  const { key } = req.params
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

function getComment (req, res) {
  console.log('get', req.originalUrl)
  const { key, id } = req.params
  const issueIndex = issues.findIndex(issue => issue.key === key)
  const data = issues[issueIndex].fields.comment.comments[id]
  res.json(data)
}

function putComment (req, res) {
  console.log('put', req.originalUrl, req.body)
  const { key, id } = req.params
  const { body } = req.body
  const issueIndex = issues.findIndex(issue => issue.key === key)
  issues[issueIndex].fields.comment.comments[id].body = body
  res.json({ status: 200, ok: true, statusText: 'OK' })
}

function deleteComment (req, res) {
  console.log('delete', req.originalUrl)
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
