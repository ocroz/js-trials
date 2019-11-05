'use strict'

const fs = require('fs')
const { buildDriver, renameGroup, quitDriver } = require('./lib/selenium-rename')

const EOL = '\n' // Or '\r\n'

renameGroups()
async function renameGroups () {
  let driver = await buildDriver()

  //     p='app-jira-'; cat archProjectKeys.txt | while read k;do k=$(echo $k); echo $p${k,,}-a; echo $p${k,,}-rw; echo $p${k,,}-r; done > archProjectGroups.txt
  // p='app-confluence-'; cat archSpaceKeys.txt | while read k;do k=$(echo $k); echo $p${k,,}-a; echo $p${k,,}-rw; echo $p${k,,}-r; done > archSpaceGroups.txt
  const lines = fs.readFileSync('./archArsGroups.txt', 'utf-8').split(EOL).filter(Boolean)

  for (let line of lines) {
    const [from, to] = [line, line + '-archived']
    console.log(`Renaming ${from} as ${to} ...`)
    await renameGroup(driver, from, to)
    // break // For testing
  }

  await quitDriver(driver)
}
