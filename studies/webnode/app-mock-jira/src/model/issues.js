'use strict'

const { getMyself } = require('./system')

let issues = []

function addIssue (issueData) {
  // error first
  if (!issueData) { return {error: 'No issue data provided'} }
  if (!issueData.fields) { return {error: 'No issue fields provided'} }
  if (!issueData.fields.summary) { return {error: 'No issue summary provided'} }
  if (!issueData.fields.project || !issueData.fields.project.key) { return {error: 'No issue project provided'} }
  if (!issueData.fields.issuetype || !issueData.fields.issuetype.name) { return {error: 'No issue type provided'} }

  // new issue
  const active = true
  const key = `${issueData.fields.project.key}-${issues.length + 1}`
  const fields = issueData.fields
  fields.reporter = fields.reporter || getMyself()
  fields.assignee = fields.assignee || getMyself()
  fields.description = fields.description || ''
  fields.status = { name: 'Open' }
  fields.comment = { comments: [] }
  const issue = { active, key, fields }
  issues.push(issue)
  return issue
}

function deleteIssue (key) {
  const issueIndex = issues.findIndex(issue => issue.key === key)
  console.log(`Delete issue ${key} (issueIndex: ${issueIndex})`)
  issues[issueIndex].active = false
}

function getIssue (key) {
  const issueIndex = issues.findIndex(issue => issue.key === key)
  const issue = issues[issueIndex]
  issue.fields.comment.comments = issue.fields.comment.comments.filter(comment => comment.active)
  return issue
}

function getIssues () {
  const data = issues.filter(issue => issue.active)
  data.forEach((issue, i) => {
    data[i].fields.comment.comments =
      data[i].fields.comment.comments
      .filter(comment => comment.active)
  })
  return data
}

function addComment (key, body) {
  const issueIndex = issues.findIndex(issue => issue.key === key)
  const active = true
  const id = issues[issueIndex].fields.comment.comments.length
  const author = getMyself()
  const created = new Date()
  const comment = { active, id, author, body, created }
  issues[issueIndex].fields.comment.comments.push(comment)
}

function deleteComment (key, cid) {
  const issueIndex = issues.findIndex(issue => issue.key === key)
  console.log(`Delete comment ${cid} of issue ${key} (issueIndex: ${issueIndex})`)
  issues[issueIndex].fields.comment.comments[cid].active = false
}

function getComment (key, cid) {
  const issueIndex = issues.findIndex(issue => issue.key === key)
  const data = issues[issueIndex].fields.comment.comments[cid]
  return data
}

function updateComment (key, cid, body) {
  const issueIndex = issues.findIndex(issue => issue.key === key)
  issues[issueIndex].fields.comment.comments[cid].body = body
}

module.exports = {
  /* eslint-disable object-property-newline */
  addIssue, deleteIssue, getIssue, getIssues,
  addComment, deleteComment, getComment, updateComment
}
