'use strict'

function getMyself () {
  const myself = {
    key: process.env.USERNAME,
    name: process.env.USERNAME
  }
  return myself
}

function getIssueTypes () {
  const issueTypes = [
    {
      iconUrl: '',
      name: 'Bug'
    },
    {
      iconUrl: '',
      name: 'Task'
    }
  ]
  return issueTypes
}

function getPriorities () {
  const priorities = [
    {
      iconUrl: '',
      name: 'Critical'
    },
    {
      iconUrl: '',
      name: 'Serious'
    }
  ]
  return priorities
}

function getStatuses () {
  const statuses = [
    {
      iconUrl: '',
      name: 'Open'
    },
    {
      iconUrl: '',
      name: 'Resolved'
    }
  ]
  return statuses
}

module.exports = { getMyself, getIssueTypes, getPriorities, getStatuses }
