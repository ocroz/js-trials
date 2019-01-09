'use strict'

const cheerio = require('cheerio')
const https = require('https')
const fetch = require('node-fetch')

const baseUrl = 'https://atlassian.hq.k.grp/confluence'
const spaceKeys = ['ANYCAST']

const [user, pass] = [process.env['USERNAME'], process.env['pw']] // you should export pw
const agent = new https.Agent({ rejectUnauthorized: false }) // insecure
const headers = { Authorization: 'Basic ' + Buffer.from(user + ':' + pass, 'binary').toString('base64') }

// const fs = require('fs')
// const htmlFile = process.argv[2] || console.error('Error: Missing parameter htmlFile')
// const html = fs.readFileSync(htmlFile).toString()
// const $ = cheerio.load(html)

listPluginUsage()
async function listPluginUsage () {
  const html = await getPluginUsage()
  const $ = cheerio.load(html)

  console.log('Add-on name;CQL;Used in spaces')
  $('h2').each(async (ih2, h2) => {
    if ($(h2).text() === 'All macros') {
      const tr = $(h2).parent().find('table tbody tr').toArray()
      for (let itr = 0; itr < tr.length; itr++) { // use for loop over each(async fn) to preserve order
        // console.log($(tr[itr]).html())
        const addonName = $($($(tr[itr]).contents()[0]).contents()[0]).text() // contents()[1] if html from file
        // const addonUsage = $($(tr[itr]).contents()[1]).text() // server wide usage should be > 0
        const macros = []
        $(tr[itr]).find('li').each((ili, li) => {
          macros.push(
            $(li).html().replace(/\n/g, '').replace(/.*cql=macro.%3D./, '').replace(/".*/, '').replace(/&quot;/g, '"')
          )
        })
        const cql = 'macro+in(' + macros.join() + ')+and+space+in(' + spaceKeys.join() + ')'
        // const searchUrl = baseUrl + '/dosearchsite.action?cql=' + cql
        const searchUrl = baseUrl + '/rest/api/content/search?cql=' + cql + '&limit=1'
        const nbResults = await getResults(searchUrl)
        console.log(addonName, ';', cql, ';', nbResults > 0)
      }
    }
  })
}

async function getPluginUsage () {
  return new Promise((resolve, reject) => {
    fetch(baseUrl + '/admin/pluginusage.action', {agent, headers})
    .catch(err => console.error(err))
    .then(resp => resp.text().then(data => resolve(data))) // text
  })
}

async function getResults (searchUrl) {
  return new Promise((resolve, reject) => {
    fetch(searchUrl, {agent, headers})
    .catch(err => console.error(err))
    .then(resp => resp.json().then(data => { resolve(data.size) })) // json
  })
}

// function whoami () {
//   fetch(baseUrl + '/rest/api/user/current').catch(err => console.error(err))
//   fetch(baseUrl + '/rest/api/user/current', {agent}).then(resp => resp.json().then(data => { console.log(data) }))
//   fetch(baseUrl + '/rest/api/user/current', {agent, headers}).then(resp => resp.json().then(data => { console.log(data) }))
// }
// whoami()
