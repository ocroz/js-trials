'use strict'

const fs = require('fs')
const { buildDriver, addMembers, quitDriver } = require('./lib/selenium-members')

const group = 'app-confluence-hlcustdoc-rw'
const CHUNK = 25

renameGroups()
async function renameGroups () {
  let driver = await buildDriver()

  const emails = fs.readFileSync('./archArsMembers.txt', 'utf-8').split(';').filter(Boolean)

  for (let i = 0; i < emails.length; i += CHUNK) {
    console.log(emails.slice(i, i + CHUNK).join(';'))
    await addMembers(driver, group, emails.slice(i, i + CHUNK).join(';'))
    // break // For testing
  }

  await quitDriver(driver)
}
