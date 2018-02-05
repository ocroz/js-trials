#!node

const search = require('./search.json')

const DELIM = ';'

// Create a map of { 'project, issuetype', count }
const issueMap = new Map()
for (let issue of search.issues) {
  const { fields: { issuetype: { name: issuetype }, project: { key: project } } } = issue
  const mapKey = JSON.stringify({project, issuetype})
  const count = issueMap.get(mapKey) || 0
  issueMap.set(mapKey, count + 1)
}
// sort and print
const issueMapAsc = new Map([...issueMap].sort())
console.log(`project${DELIM}issuetype${DELIM}count`)
for (let [key, value] of issueMapAsc) {
  const {project, issuetype} = JSON.parse(key)
  console.log(`${project}${DELIM}${issuetype}${DELIM}${value}`)
}
