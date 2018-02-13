'use strict'

const { getIssueTypes } = require('./system')

function getProject (key) {
  const project = {
    project: { key },
    issueTypes: getIssueTypes(),
    components: [
      { name: 'TOTO' },
      { name: 'TOUTOU' },
      { name: 'TATA' },
      { name: 'MOUNIN' },
      { name: 'TINTIN' }
    ],
    versions: [
      {
        name: 'TOTO_1.0',
        archived: false,
        released: true
      },
      {
        name: 'TOTO_2.0',
        archived: false,
        released: true
      },
      {
        name: 'TOTO_3.0',
        archived: false,
        released: false
      },
      {
        name: 'TATA_1.0',
        archived: false,
        released: false
      }
    ]
  }
  return project
}

module.exports = { getProject }
