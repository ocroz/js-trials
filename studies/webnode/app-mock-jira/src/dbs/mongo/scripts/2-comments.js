/* global db uuid meta */

// POST rest/api/2/issue/SPLPRJ-X/comment
[
  {key: 'SPLPRJ-1', cid: 1, body: 'First comment created on SPLPRJ-1.'},
  {key: 'SPLPRJ-1', cid: 2, body: 'First comment created on SPLPRJ-1.'},
  {key: 'SPLPRJ-1', cid: 3, body: 'First comment created on SPLPRJ-1.'},
  {key: 'SPLPRJ-2', cid: 1, body: 'First comment created on SPLPRJ-2.'}
].forEach(({key, cid, body}) => {
  db.eventlog.insert({
    _id: uuid(),
    type: 'comment-created',
    data: { meta: meta('mongosh', `${key}/comment/${cid}`), payload: { body } }
  })
})

// PUT rest/api/2/issue/SPLPRJ-X/comment/Y
db.eventlog.insert({
  _id: uuid(),
  type: 'comment-updated',
  data: {
    meta: meta('mongosh', 'SPLPRJ-1/comment/2'),
    payload: { body: 'Second comment updated on SPLPRJ-1.' }
  }
})

// DELETE rest/api/2/issue/SPLPRJ-X/comment/Y
db.eventlog.insert({
  _id: uuid(),
  type: 'comment-deleted',
  data: {
    meta: meta('mongosh', 'SPLPRJ-1/comment/3'),
    payload: { }
  }
})
