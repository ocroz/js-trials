'use strict'

const { dockerPort } = require('../env/index')
const baseUrl = `http://localhost:${dockerPort}/jira`

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
      id: 3,
      description: 'A task that needs to be done.',
      iconUrl: `${baseUrl}/images/icons/issuetypes/task.svg`,
      name: 'Task',
      subtask: false
    },
    {
      id: 2,
      description: 'A new feature of the product, which has yet to be developed.',
      iconUrl: `${baseUrl}/images/icons/issuetypes/newfeature.svg`,
      name: 'New Feature',
      subtask: false
    },
    {
      id: 4,
      description: 'An improvement or enhancement to an existing feature or task.',
      iconUrl: `${baseUrl}/images/icons/issuetypes/improvement.svg`,
      name: 'Improvement',
      subtask: false
    },
    {
      id: 1,
      description: 'A problem which impairs or prevents the functions of the product.',
      iconUrl: `${baseUrl}/images/icons/issuetypes/bug.svg`,
      name: 'Bug',
      subtask: false
    },
    {
      id: 22,
      description: '',
      iconUrl: `${baseUrl}/images/icons/issuetypes/subtask.svg`,
      name: 'Sub-task',
      subtask: true
    }
  ]
  return issueTypes
}

function getPriorities () {
  const priorities = [
    {
      description: 'Blocks development and/or testing work, production could not run.',
      iconUrl: `${baseUrl}/images/icons/priorities/blocker.svg`,
      name: 'Blocker',
      id: 1
    },
    {
      description: 'Crashes, loss of data, severe memory leak.',
      iconUrl: `${baseUrl}/images/icons/priorities/critical.svg`,
      name: 'Critical',
      id: 2
    },
    {
      description: 'Major loss of function.',
      iconUrl: `${baseUrl}/images/icons/priorities/major.svg`,
      name: 'Major',
      id: 3
    },
    {
      description: 'Minor loss of function, or other problem where easy workaround is present.',
      iconUrl: `${baseUrl}/images/icons/priorities/minor.svg`,
      name: 'Minor',
      id: 4
    },
    {
      description: 'Cosmetic problem like misspelt words or misaligned text.',
      iconUrl: `${baseUrl}/images/icons/priorities/trivial.svg`,
      name: 'Trivial',
      id: 5
    }
  ]
  return priorities
}

function getStatuses () {
  const statuses = [
    {
      description: 'The issue is open and ready for the assignee to start work on it.',
      iconUrl: `${baseUrl}/images/icons/statuses/open.png`,
      name: 'Open',
      id: 1,
      statusCategory: {
        id: 2,
        key: 'new',
        colorName: 'blue-gray',
        name: 'To Do'
      }
    },
    {
      description: 'This issue is being actively worked on at the moment by the assignee.',
      iconUrl: `${baseUrl}/images/icons/statuses/inprogress.png`,
      name: 'In Progress',
      id: 3,
      statusCategory: {
        id: 4,
        key: 'indeterminate',
        colorName: 'yellow',
        name: 'In Progress'
      }
    },
    {
      description: 'This issue was once resolved, but the resolution was deemed incorrect. From here issues are either marked assigned or resolved.',
      iconUrl: `${baseUrl}/images/icons/statuses/reopened.png`,
      name: 'Reopened',
      id: 4,
      statusCategory: {
        id: 2,
        key: 'new',
        colorName: 'blue-gray',
        name: 'To Do'
      }
    },
    {
      description: 'A resolution has been taken, and it is awaiting verification by reporter. From here issues are either reopened, or are closed.',
      iconUrl: `${baseUrl}/images/icons/statuses/resolved.png`,
      name: 'Resolved',
      id: 5,
      statusCategory: {
        id: 3,
        key: 'done',
        colorName: 'green',
        name: 'Done'
      }
    },
    {
      description: 'The issue is considered finished, the resolution is correct. Issues which are closed can be reopened.',
      iconUrl: `${baseUrl}/images/icons/statuses/closed.png`,
      name: 'Closed',
      id: 6,
      statusCategory: {
        id: 3,
        key: 'done',
        colorName: 'green',
        name: 'Done'
      }
    },
    {
      description: '',
      iconUrl: `${baseUrl}/images/icons/statuses/needinfo.png`,
      name: 'Waiting for info',
      id: 10000,
      statusCategory: {
        id: 4,
        key: 'indeterminate',
        colorName: 'yellow',
        name: 'In Progress'
      }
    }
  ]
  return statuses
}

module.exports = { getMyself, getIssueTypes, getPriorities, getStatuses }
