'use strict'

const { getMyself, getIssueTypes, getPriorities, getStatuses } = require('./system')

let issues = []
const cfRank = 'customfield_11450'

function addIssue (issueData) {
  // error first
  if (!issueData) { return {error: 'No issue data provided'} }
  if (!issueData.fields) { return {error: 'No issue fields provided'} }
  if (!issueData.fields.summary) { return {error: 'No issue summary provided'} }
  if (!issueData.fields.project || !issueData.fields.project.key) { return {error: 'No issue project provided'} }
  if (!issueData.fields.issuetype || !issueData.fields.issuetype.name) { return {error: 'No issue type provided'} }
  if (!issueData.fields.priority) { issueData.fields.priority = {} } // Default value is 'Major'

  // new issue
  const active = true
  const key = `${issueData.fields.project.key}-${issues.length + 1}`
  const fields = issueData.fields
  fields.reporter = fields.reporter || getMyself()
  fields.assignee = fields.assignee || getMyself()
  fields.description = fields.description || ''
  fields.issuetype = getIssueTypes().filter(item => item.name === issueData.fields.issuetype.name)[0]
  fields.priority = getPriorities().filter(item => item.name === (issueData.fields.priority.name || 'Major'))[0]
  fields.status = getStatuses().filter(item => item.name === 'Open')[0]
  fields.components = fields.components || []
  fields.versions = fields.versions || []
  fields.fixVersions = fields.fixVersions || []
  fields.resolution = { name: 'Unresolved' }
  fields.comment = { comments: [] }
  fields.updated = fields.created = new Date()
  fields[cfRank] = issues.length + 1
  const issue = { active, key, fields }
  issues.push(issue)
  return issue
}

function deleteIssue (key) {
  const issueIndex = issues.findIndex(issue => issue.key === key)
  console.log(`Delete issue ${key} (issueIndex: ${issueIndex})`)
  issues[issueIndex].active = false
  issues[issueIndex].fields.updated = new Date()
  return true
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
  issues[issueIndex].fields.updated = new Date()
  return comment
}

function deleteComment (key, cid) {
  const issueIndex = issues.findIndex(issue => issue.key === key)
  console.log(`Delete comment ${cid} of issue ${key} (issueIndex: ${issueIndex})`)
  issues[issueIndex].fields.comment.comments[cid].active = false
  issues[issueIndex].fields.updated = new Date()
  return true
}

function getComment (key, cid) {
  const issueIndex = issues.findIndex(issue => issue.key === key)
  return issues[issueIndex].fields.comment.comments[cid]
}

function updateComment (key, cid, body) {
  const issueIndex = issues.findIndex(issue => issue.key === key)
  issues[issueIndex].fields.comment.comments[cid].body = body
  issues[issueIndex].fields.updated = new Date()
  return issues[issueIndex].fields.comment.comments[cid]
}

function rankIssues (newRanks) {
  const rankBeforeIssueIndex = issues.findIndex(issue => issue.key === newRanks.rankBeforeIssue)
  const issueIndex = issues.findIndex(issue => issue.key === newRanks.issues[0])

  console.log('rank', {
    issue: issues[issueIndex].key + ' (' + issues[issueIndex].fields[cfRank] + ')',
    rankBeforeIssue: issues[rankBeforeIssueIndex].key + ' (' + issues[rankBeforeIssueIndex].fields[cfRank] + ')'
  }, issues[issueIndex].fields[cfRank] > issues[rankBeforeIssueIndex].fields[cfRank])

  if (issues[issueIndex].fields[cfRank] > issues[rankBeforeIssueIndex].fields[cfRank]) {
    const beforeIssueRank = issues[rankBeforeIssueIndex].fields[cfRank]
    issues[rankBeforeIssueIndex].fields[cfRank] = issues[issueIndex].fields[cfRank]
    issues[issueIndex].fields[cfRank] = beforeIssueRank
  }
  return true
}

module.exports = {
  /* eslint-disable object-property-newline */
  addIssue, deleteIssue, getIssue, getIssues,
  addComment, deleteComment, getComment, updateComment,
  rankIssues
}
