'use strict'

const { Router } = require('express')

const {
  addIssue, deleteIssue, getIssue, getIssues,
  addComment, deleteComment, getComment, updateComment
} = require('../model/issues')

const { getProject } = require('../model/projects')
const { getMyself, getPriorities } = require('../model/system')

const router = new Router()

const DELAY = 200

router.post('/issue', _postIssue)
router.get('/issue/fake', _addFake)
router.get('/issue/:key', _getIssue)
router.post('/issue/:key/comment', _postComment)
router.get('/issue/:key/comment/:cid', _getComment)
router.put('/issue/:key/comment/:cid', _putComment)
router.delete('/issue/:key/comment/:cid', _deleteComment)
router.put('/issue/:key', _putIssue)
router.delete('/issue/:key', _deleteIssue)
router.get('/myself', _getMyself)
router.get('/priority', _getPriorities)
router.get('/project/:key', _getProject)
router.get('/search', _getIssues)

module.exports = router

function _getMyself (req, res) {
  console.log('get', req.originalUrl)
  const data = getMyself()
  res.json(data)
}

function _getPriorities (req, res) {
  console.log('get', req.originalUrl)
  const data = getPriorities()
  res.json(data)
}

function _getProject (req, res) {
  console.log('get', req.originalUrl)
  const data = getProject(req.params.key)
  res.json(data)
}

function _addFake (req, res) {
  console.log('get', req.originalUrl)

  // > For testing
  const myself = getMyself()
  const issueData = { fields: {
    summary: 'An issue',
    project: { key: 'SPLPRJ' },
    issuetype: { name: 'Task' },
    reporter: myself,
    assignee: myself,
    description: 'A description'
  }}
  const data = addIssue(issueData)
  // < For testing

  res.json(data)
}

function _getIssue (req, res) {
  console.log('get', req.originalUrl)
  const data = getIssue(req.params.key)
  setTimeout(() => res.json(data), DELAY) // Simulate a long server processing
}

function _getIssues (req, res) {
  console.log('get', req.originalUrl)
  const data = { issues: getIssues() }
  setTimeout(() => res.json(data), DELAY) // Simulate a long server processing
}

function _postIssue (req, res) {
  console.log('post', req.originalUrl, req.body)
  const data = addIssue(req.body)
  res.status(data.error ? 400 : 200).json(data)
}

function _putIssue (req, res) {
  console.log('put', req.originalUrl, req.body)
  // const { key } = req.params
  res.end()
}

function _deleteIssue (req, res) {
  console.log('delete', req.originalUrl)
  deleteIssue(req.params.key)
  res.status(204).end()
}

function _postComment (req, res) {
  console.log('post', req.originalUrl, req.body)
  const data = addComment(req.params.key, req.body.body)
  res.json(data)
}

function _getComment (req, res) {
  console.log('get', req.originalUrl)
  const data = getComment(req.params.key, req.params.cid)
  res.json(data)
}

function _putComment (req, res) {
  console.log('put', req.originalUrl, req.body)
  const data = updateComment(req.params.key, req.params.cid, req.body.body)
  res.json(data)
}

function _deleteComment (req, res) {
  console.log('delete', req.originalUrl)
  deleteComment(req.params.key, req.params.cid)
  res.status(204).end()
}
