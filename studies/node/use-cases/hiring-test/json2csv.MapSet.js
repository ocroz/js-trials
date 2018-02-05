#!node

const search = require('./search.json')

const DELIM = ';'

// Create sets of { project } & { issuetype }, and
// Create map of { 'project, issuetype', count }
const projectSet = new Set()
const issueSet = new Set()
const issueMap = new Map()
for (let issue of search.issues) {
  const { fields: { issuetype: { name: issuetype }, project: { key: project } } } = issue
  projectSet.add(project)
  issueSet.add(issuetype)
  const mapKey = JSON.stringify({project, issuetype})
  const count = issueMap.get(mapKey) || 0
  issueMap.set(mapKey, count + 1)
}
// sort and print
const projectSetAsc = new Set([...projectSet].sort())
const issueSetAsc = new Set([...issueSet].sort())
console.log(`project${DELIM}` + [...issueSetAsc].join(DELIM))
for (let project of projectSetAsc) {
  let csvline = project
  for (let issuetype of issueSetAsc) {
    const count = issueMap.get(JSON.stringify({project, issuetype})) || 0
    csvline += `${DELIM}${count}`
  }
  console.log(csvline)
}
