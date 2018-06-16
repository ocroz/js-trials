/* global db */

db.eventlog.aggregate([
  { $match: { type: { $regex: /comment-/ } } },
  { $group: {
    _id: '$_id',
    comment: { $push: {
      type: '$type', id: '$data.meta.correlationId', body: '$data.payload.body'
    } }
  } }
])

db.eventlog.aggregate([
  { $match: { type: { $regex: /comment-/ } } },
  { $project: { type: '$type', api: '$data.meta.correlationId', body: '$data.payload.body' } }
])

db.eventlog.aggregate([
  { $match: { type: { $regex: /comment-/ } } },
  { $project: { type: '$type', api: { $concat: [ 'rest/api/2/issue/', '$data.meta.correlationId' ] }, body: '$data.payload.body' } },
  { $group: { _id: '$api', op: { $push: { type: '$type', body: '$body' } } } }
])

db.eventlog.aggregate([
  { $match: { type: { $regex: /comment-/ } } },
  { $project: { type: '$type', api: '$data.meta.correlationId', body: '$data.payload.body' } },
  { $group: { _id: '$api', op: { $push: { type: '$type', body: '$body' } } } },
  { $project: { op: { $filter: { input: '$op', cond: { $ne: [ '$$this.type', 'comment-deleted' ] } } } } }
])

db.eventlog.aggregate([
  { $match: { type: { $regex: /comment-/ } } },
  { $project: { type: '$type', api: '$data.meta.correlationId', body: '$data.payload.body' } },
  { $group: { _id: '$api', op: { $push: { type: '$type', body: '$body' } } } }
])

db.eventlog.aggregate([
  { $match: { type: { $regex: /comment-/ } } },
  { $project: { type: '$type', api: '$data.meta.correlationId', body: '$data.payload.body' } },
  { $group: { _id: '$api', actions: { $push: { type: '$type', body: '$body' } } } },
  { $project: { _id: '$_id', lastAction: { $arrayElemAt: [ '$actions', -1 ] } } }
])
