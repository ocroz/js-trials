/* global db print */

// aggregate the comments first
let comments = {}
db.eventlog.aggregate([
  // { $match: { 'data.meta.correlationId': { $regex: /SPLPRJ-1/ } } }, // only aggregate this issue
  { $match: { type: { $regex: /comment-/ } } },
  { $project: { _id: { $split: [ '$data.meta.correlationId', '/' ] }, event: '$type', fields: '$data.payload' } },
  { $group: {
    _id: { key: { $arrayElemAt: [ '$_id', 0 ] }, cid: { $arrayElemAt: [ '$_id', 2 ] } },
    lastEvent: { $last: '$event' },
    fields: { $mergeObjects: '$fields' }
  } },
  { $sort: { '_id': 1 } },
  { $match: { lastEvent: { $ne: 'comment-deleted' } } },
  { $group: { _id: '$_id.key', comments: { $push: { id: '$_id.cid', lastEvent: '$lastEvent', fields: '$fields' } } } },
  { $sort: { '_id': 1 } }
]).forEach(issueComments => {
  // print('issueComments:', JSON.stringify(issueComments))
  comments[issueComments._id] = issueComments.comments
})
print('comments:', JSON.stringify(comments)) // or comments['SPLPRJ-1']

// then aggregate the issues with their comments
let issues = {}
db.eventlog.aggregate([
  // { $match: { 'data.meta.correlationId': { $regex: /SPLPRJ-1/ } } }, // only aggregate this issue
  { $match: { type: { $regex: /issue-/ } } },
  { $group: {
    _id: '$data.meta.correlationId',
    lastEvent: { $last: '$type' },
    fields: { $mergeObjects: '$data.payload.fields' }
  } },
  { $match: { lastEvent: { $ne: 'issue-deleted' } } },
  { $sort: { '_id': 1 } }
]).forEach(issue => {
  // print('issue', JSON.stringify(issue))
  issues[issue._id] = { lastEvent: issue.lastEvent, fields: issue.fields }
  issues[issue._id].fields.comment = { comments: comments[issue._id] }
})
print('issues:', JSON.stringify(issues)) // or issues['SPLPRJ-1']
