'use strict'

// https://atlassian.mycompany/confluence/rest/api/space?type=global&status=current&expand=description.plain&limit=100
// https://atlassian.mycompany/confluence/rest/api/space?type=global&status=current&expand=description.plain&start=100&limit=100
// https://atlassian.mycompany/confluence/rest/api/space?type=global&status=current&expand=description.plain&start=200&limit=100

// https://community.atlassian.com/t5/Answers-Developer-Questions/How-to-get-space-with-category-using-Confluence-REST-API/qaq-p/500904
// https://atlassian.mycompany/confluence/rest/spacedirectory/1/search?type=global&status=current

const spaces = require('./spaces.json')

const DELIM = ';'

console.log(`key${DELIM}name${DELIM}description${DELIM}url`)
for (let space of spaces.results) {
  const { key, name, description: { plain: { value: description } } } = space
  const url = `${spaces._links.base}/display/${key}`
  console.log(`${key}${DELIM}"${name}"${DELIM}"${description}"${DELIM}${url}`)
}
