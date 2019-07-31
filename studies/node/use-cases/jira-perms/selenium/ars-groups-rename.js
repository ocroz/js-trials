'use strict'

const fs = require('fs')
const { buildDriver, renameGroup, quitDriver } = require('./lib/selenium-rename')

renameGroups()
async function renameGroups () {
  let driver = await buildDriver()

  // cat archProjectKeys.txt | while read k;do k=$(echo $k); echo app-jira-${k,,}-a; echo app-jira-${k,,}-rw; echo app-jira-${k,,}-r; done > archProjectGroups.txt
  const lines = fs.readFileSync('./archProjectGroups.txt', 'utf-8').split('\n').filter(Boolean)

  for (let line of lines) {
    const [from, to] = [line, line + '-archived']
    console.log(`Renaming ${from} as ${to} ...`)
    await renameGroup(driver, from, to)
  }

  await quitDriver(driver)
}
