/* global db ObjectId */

db.dropDatabase()

/* eslint-disable no-unused-vars */
const uuid = () => ObjectId()
const meta = (input) => Object.assign({ created: new Date() }, input)
