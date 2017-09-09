'use strict'
const { Router } = require('express')

const router = new Router()

router.get('/', getIssues)
router.post('/', postIssue)
router.get('/fake', getFake)
router.put('/:key', putIssue)
router.delete('/:key', deleteIssue)

module.exports = router

function getFake (req, res) {
  console.log('get /api/fake')

  // > For testing
  const [issuetype, reporter, assignee, summary, description] =
    ['Task', 'crozier', 'crozier', 'An issue', 'A description']
  addIssue({issuetype, reporter, assignee, summary, description})
  // < For testing

  setTimeout(() => res.json({ status: 200, ok: true, statusText: 'OK' }), 200)
}

function getIssues (req, res) {
  console.log('get /api')
  const data = { issues: issues.filter(issue => issue.active) }
  setTimeout(() => res.json(data), 200) // Simulate a long server processing
}

function postIssue (req, res) {
  console.log(req.body)
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

let issues = []
function addIssue ({issuetype, reporter, assignee, summary, description}) {
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
    description
  }
  const issue = { key, active, fields }
  issues.push(issue)
}
