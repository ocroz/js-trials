'use strict'

function getProject (key) {
  const project = {
    project: { key },
    issueTypes: [
      {
        iconUrl: '',
        name: 'Improvement'
      },
      {
        iconUrl: '',
        name: 'Task'
      }
    ],
    components: [
      { name: 'TOTO' },
      { name: 'TATA' }
    ],
    versions: [
      {
        archived: false,
        released: true,
        name: 'TOTO_1.0'
      },
      {
        archived: false,
        released: true,
        name: 'TOTO_2.0'
      },
      {
        archived: false,
        released: false,
        name: 'TOTO_3.0'
      },
      {
        archived: false,
        released: false,
        name: 'TATA_1.0'
      }
    ]
  }
  return project
}

module.exports = { getProject }
