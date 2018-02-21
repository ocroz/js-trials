'use strict'

const cfRank = 'rank'
const issues = [
  {key: 'I-1', fields: { [cfRank]: 4 }},
  {key: 'I-2', fields: { [cfRank]: 1 }},
  {key: 'I-3', fields: { [cfRank]: 2 }},
  {key: 'I-4', fields: { [cfRank]: 5 }},
  {key: 'I-5', fields: { [cfRank]: 3 }}
]

// rankIssues() permutates the cfRank value on 2 issues
function rankIssues (input, next) {
  setTimeout(() => {
    console.log(input)
    // fetch remote api here => received response is OK (no data)
    next && next()
  }, 20)
}

// getIssues() or refreshIssues() after every rankIssues()
function getIssues (input, next) {
  setTimeout(() => {
    console.log('getIssues()')

    // fetch remote api here => received response is issues[]
    const issueIndex = issues.findIndex(issue => issue.key === input.issues[0])
    const rankBeforeIssueIndex = issues.findIndex(issue => issue.key === input.rankBeforeIssue)
    const thisRank = issues[issueIndex].fields[cfRank]
    issues[issueIndex].fields[cfRank] = issues[rankBeforeIssueIndex].fields[cfRank]
    issues[rankBeforeIssueIndex].fields[cfRank] = thisRank

    next && next()
  }, 20)
}

// Sort the issues by rank after every getIssues()
let issuesByRank
function newSort () {
  issuesByRank = []
  issues.forEach(issue => { issuesByRank.push(issue) })
  issuesByRank.sort((a, b) => a.fields[cfRank] > b.fields[cfRank])
}

// processSeq(i) calls "rankIssues() then getIssues() then processSeq(i-1)" if issues[i] has the incorrect cfRank value
// otherwise calls next "processSeq(i-1)"
function processSeq (i) {
  if (i >= 0) {
    newSort()
    // console.log(i, `{${issues[i].key} ${issues[i].fields[cfRank]}}`, `{${issuesByRank[i].key} ${issuesByRank[i].fields[cfRank]}}`)
    if (issues[i].key !== issuesByRank[i].key) {
      const input = { issues: [issues[i].key], rankBeforeIssue: issuesByRank[i].key }
      rankIssues(input, () => getIssues(input, () => processSeq(i - 1)))
    } else {
      processSeq(i - 1)
    }
  } else {
    console.log(issues)
  }
}

console.log(issues)
processSeq(issues.length - 1)
