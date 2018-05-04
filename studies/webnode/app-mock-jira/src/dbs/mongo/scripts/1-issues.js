/* global db uuid meta */

/* eslint-disable object-property-newline */
const issue1 = {
  summary: 'Mongo issue 1', project: {name: 'SPLPRJ'}, submitter: {name: 'crozier'},
  issuetype: {name: 'Task'}, priority: {name: 'Major'}, status: {name: 'Open'}
}
const issue2 = {
  summary: 'Mongo issue 2', project: {name: 'SPLPRJ'}, submitter: {name: 'crozier'},
  issuetype: {name: 'New Feature'}, priority: {name: 'Critical'}, status: {name: 'Open'}
}
/* eslint-disable object-property-newline */

// POST rest/api/2/issue
db.eventlog.insert({
  _id: uuid(),
  type: 'issue-created',
  data: {
    meta: meta('mongosh', 'SPLPRJ-1'),
    payload: { fields: issue1 }
  }
})
db.eventlog.insert({
  _id: uuid(),
  type: 'issue-created',
  data: {
    meta: meta('mongosh', 'SPLPRJ-2'),
    payload: { fields: issue2 }
  }
})

// PUT rest/api/2/issue/SPLPRJ-1
db.eventlog.insert({
  _id: uuid(),
  type: 'issue-updated',
  data: {
    meta: meta('mongosh', 'SPLPRJ-1'),
    payload: { fields: { issuetype: { name: 'Bug' } } }
  }
})

// aggregate issues
db.eventlog.aggregate([
  { $group: { _id: '$data.meta.correlationId', fields: { $mergeObjects: '$data.payload.fields' } } }
]).pretty()
