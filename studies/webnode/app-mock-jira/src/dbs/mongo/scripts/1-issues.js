/* global print db uuid meta */

/* eslint-disable object-property-newline */
const issue1 = {
  summary: 'Mongo issue 1', project: {name: 'SPLPRJ'}, submitter: {name: 'crozier'},
  issuetype: {name: 'Task'}, priority: {name: 'Major'}, status: {name: 'Open'}
}
const issue2 = {
  summary: 'Mongo issue 2', project: {name: 'SPLPRJ'}, submitter: {name: 'crozier'},
  issuetype: {name: 'New Feature'}, priority: {name: 'Critical'}, status: {name: 'Open'}
}
const issue3 = {
  summary: 'Mongo issue 3', project: {name: 'SPLPRJ'}, submitter: {name: 'crozier'},
  issuetype: {name: 'Bug'}, priority: {name: 'Blocker'}, status: {name: 'Open'}
}
/* eslint-disable object-property-newline */

;[
  // POST rest/api/2/issue
  {type: 'issue-created', key: 'SPLPRJ-1', fields: issue1},
  {type: 'issue-created', key: 'SPLPRJ-2', fields: issue2},
  {type: 'issue-created', key: 'SPLPRJ-3', fields: issue3},

  // PUT rest/api/2/issue/SPLPRJ-X
  {type: 'issue-updated', key: 'SPLPRJ-2', fields: { issuetype: { name: 'Improvement' } }},

  // DELETE rest/api/2/issue/SPLPRJ-X
  {type: 'issue-deleted', key: 'SPLPRJ-3', fields: null}
].forEach(({type, key, fields}) => {
  print(JSON.stringify({type, key, fields})) // Workaround or last insert() fails
  db.eventlog.insert({
    _id: uuid(), type, data: { meta: meta('mongosh', `${key}`), payload: { fields } }
  })
})

// aggregate issues
db.eventlog.aggregate([
  { $match: { type: { $regex: /issue-/ } } },
  { $group: {
    _id: '$data.meta.correlationId',
    lastEvent: { $last: '$type' },
    fields: { $mergeObjects: '$data.payload.fields' }
  } },
  { $match: { lastEvent: { $ne: 'issue-deleted' } } },
  { $sort: { '_id': 1 } } // Sort the issues
]).pretty()
