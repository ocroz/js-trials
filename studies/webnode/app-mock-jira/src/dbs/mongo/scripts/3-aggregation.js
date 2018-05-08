/* global db */

// aggregate the issues and their comments all together
db.eventlog.aggregate([
  // { $match: { 'data.meta.correlationId': { $regex: /SPLPRJ-1/ } } }, // only aggregate this issue
  { $match: { $or: [ { type: { $regex: /issue-/ } }, { type: { $regex: /comment-/ } } ] } },
  { $project: { data: { $cond: [
    { $eq: [ { $substr: [ '$type', 0, 5 ] }, 'issue' ] }, // if issue, then show issue fields, else show comment fields
    { issue: { event: '$type', key: '$data.meta.correlationId', fields: '$data.payload.fields' } },
    { comment: { event: '$type', idParts: { $split: [ '$data.meta.correlationId', '/' ] }, fields: '$data.payload' } }
  ] } } },
  { $project: { data: { $cond: [
    { $eq: [ { $type: '$data.issue' }, 'object' ] }, // get key and cid from idParts in comment
    { issue: '$data.issue' },
    { comment: {
      event: '$data.comment.event',
      key: { $arrayElemAt: [ '$data.comment.idParts', 0 ] },
      cid: { $arrayElemAt: [ '$data.comment.idParts', 2 ] },
      fields: '$data.comment.fields'
    } }
  ] } } },
  { $project: {
    _id: { $cond: [
      { $eq: [ { $type: '$data.issue' }, 'object' ] }, // set _id with key and cid
      { key: '$data.issue.key', cid: '$_id' }, // cid is uniq per issue or all issues will be grouped together
      { key: '$data.comment.key', cid: '$data.comment.cid' }
    ] },
    data: '$data'
  } },
  { $group: {
    _id: '$_id', // merge the comment fields per comment + store the last comment event
    data: { $last: '$data' },
    commentFields: { $mergeObjects: '$data.comment.fields' },
    lastCommentEvent: { $last: '$data.comment.event' }
  } },
  { $match: { 'lastCommentEvent': { $ne: 'comment-deleted' } } }, // filter out the deleted comments
  { $sort: { '_id': 1 } }, // sort the comments by cid
  { $project: {
    _id: { $cond: [
      { $eq: [ { $type: '$data.issue' }, 'object' ] }, // set _id with null cid for comment
      '$_id',
      { key: '$_id.key', cid: null }
    ] },
    data: { $cond: [
      { $eq: [ { $type: '$data.issue' }, 'object' ] }, // store cid and commentFields into the comment
      { issue: '$data.issue' },
      { comment: { id: '$_id.cid', lastEvent: '$lastCommentEvent', fields: '$commentFields' } }
    ] }
  } },
  { $group: { _id: '$_id', data: { $last: '$data' }, comments: { $push: '$data.comment' } } }, // group comments per key
  { $sort: { '_id': 1 } }, // sort the issues by key and _id
  { $project: {
    _id: { key: '$_id.key' },
    data: { $cond: [
      { $eq: [ { $type: '$data.issue' }, 'object' ] }, // create a common fields object
      '$data.issue',
      { fields: { comment: { comments: '$comments' } } }
    ] }
  } },
  { $group: { _id: '$_id', lastEvent: { $last: '$data.event' }, fields: { $mergeObjects: '$data.fields' } } }, // merge issue
  { $match: { 'lastEvent': { $ne: 'issue-deleted' } } }, // filter out the deleted issues
  { $sort: { '_id': 1 } }, // sort the issues by key
  { $project: { _id: false, key: '$_id.key', lastEvent: '$lastEvent', fields: '$fields' } } // Extract key from _id
]).pretty()
