/* global print db uuid meta */

[
  // POST rest/api/2/issue/SPLPRJ-X/comment
  {type: 'comment-created', key: 'SPLPRJ-1', cid: 1, body: 'First comment created on SPLPRJ-1.'},
  {type: 'comment-created', key: 'SPLPRJ-1', cid: 2, body: 'Second comment created on SPLPRJ-1.'},
  {type: 'comment-created', key: 'SPLPRJ-1', cid: 3, body: 'Third comment created on SPLPRJ-1.'},
  {type: 'comment-created', key: 'SPLPRJ-2', cid: 1, body: 'First comment created on SPLPRJ-2.'},

  // PUT rest/api/2/issue/SPLPRJ-X/comment/Y
  {type: 'comment-updated', key: 'SPLPRJ-1', cid: 2, body: 'Second comment updated on SPLPRJ-1.'},

  // DELETE rest/api/2/issue/SPLPRJ-X/comment/Y
  {type: 'comment-deleted', key: 'SPLPRJ-1', cid: 3, body: null}
].forEach(({type, key, cid, body}) => {
  print(JSON.stringify({type, cid, body})) // Workaround or last insert() fails
  db.eventlog.insert({
    _id: uuid(), type, data: { meta: meta('mongosh', `${key}/comment/${cid}`), payload: { body } }
  })
})

// aggregate comments
db.eventlog.aggregate([
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
])
