'use strict'

const fs = require('fs')
const { buildDriver, deleteGroup, quitDriver } = require('./lib/selenium-delete')

deleteGroups()
async function deleteGroups () {
  let driver = await buildDriver()

  //     p='app-jira-'; cat voidProjectKeys.txt | while read k;do k=$(echo $k); echo $p${k,,}-a; echo $p${k,,}-rw; echo $p${k,,}-r; done > voidProjectGroups.txt
  // p='app-confluence-'; cat voidSpaceKeys.txt | while read k;do k=$(echo $k); echo $p${k,,}-a; echo $p${k,,}-rw; echo $p${k,,}-r; done > voidSpaceGroups.txt
  const groups = fs.readFileSync('./voidArsGroups.txt', 'utf-8').split('\n').filter(Boolean)

  for (let group of groups) {
    console.log(`Deleting ${group} ...`)
    await deleteGroup(driver, group)
    // break // For testing
  }

  await quitDriver(driver)
}
