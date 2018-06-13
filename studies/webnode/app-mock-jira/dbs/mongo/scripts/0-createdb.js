/* global db */

db.eventlog.drop()

/* eslint-disable no-unused-vars */
const uuid = () => new Date().getTime()
const meta = (source, correlationId) => {
  return { createdAt: new Date(), saveDate: new Date(), source, correlationId }
}
