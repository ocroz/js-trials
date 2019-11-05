'use strict'

const { Builder, By, Key, until } = require('selenium-webdriver')

const TIMEOUT = 5000 // 5s
const URL = 'http://chx-ars-01/ARWebAdmin/'

async function buildDriver () {
  let driver = await new Builder().forBrowser('chrome').build()
  await driver.manage().window().maximize()
  return driver
}

async function renameGroup (driver, from, to) {
  try {
    await driver.get(URL) // await driver.navigate().to(URL) // back() // forward() // refresh()
    await driver.findElement(By.id('ctl00_Masthead_QuickSearch1_SearchStringTextBox')).sendKeys(from, Key.chord(Key.ENTER))

    // PROBLEM: Group after group the size of the right panel increases and eats the middle area then the left panel more and more
    // Workaround: Close the right panel to make the resulted groups reachable for a longer time (it fails anyway after 300+ groups)
    const rightPane = await driver.wait(until.elementLocated(By.css('.menu-pane-right')))
    try { await rightPane.findElement(By.css('.cui-icon-angle-right')).click() } catch (error) {} // Close right panel
    await driver.wait(until.elementLocated(By.xpath(`//a[text()='${from}']/../..//td`)), TIMEOUT, `LDAP group ${from} not found, skipping ...`).click()

    // Workaround: Reopen right panel to make the actions reachable again
    await rightPane.findElement(By.css('.cui-icon-angle-left')).click() // Open right panel
    await driver.wait(until.elementLocated(By.linkText('Rename'))).click()

    // Switch to iframe once loaded and rename the group
    await driver.wait(until.elementLocated(By.tagName('iframe')))
    await driver.switchTo().frame(0) // await driver.switchTo().defaultContent()
    for (let id of [
      'ctl00_FormContentPlaceHolder_CreateObjectForm_AspWizard_ctl01_ctl00_ctl00_cn',
      'ctl00_FormContentPlaceHolder_CreateObjectForm_AspWizard_ctl01_ctl01_ctl00_sAMAccountName'
    ]) {
      await driver.wait(until.elementLocated(By.id(id))).sendKeys(Key.chord(Key.CONTROL, 'a'), Key.chord(Key.DELETE), to)
    }
    await driver.wait(until.elementLocated(By.id('ctl00_FormContentPlaceHolder_CreateObjectForm_AspWizard_FinishNavigationTemplateContainerID_ctr2_BtnSave'))).click()
  } catch (error) { console.log(error) } finally { /* await driver.quit() */ }
}

// const { LegacyActionSequence } = require('selenium-webdriver/lib/actions')
// async function renameGroup (driver, from, to) {
//   try {
//     await driver.get(URL)
//     await driver.findElement(By.id('ctl00_Masthead_QuickSearch1_SearchStringTextBox')).sendKeys(from, Key.chord(Key.ENTER))
//     await driver.wait(until.elementLocated(By.xpath(`//a[text()='${from}']/../..//td`)), TIMEOUT, `LDAP group ${from} not found, skipping ...`).click()
//     const POS = 5000
//     const splitter = await driver.findElements(By.css('.splitter')).then(elems => elems.filter((elem, i) => i === 1)) // array
//     const modalHeader = await driver.findElement(By.css('.modal-header')) // single findElement()
//     await new LegacyActionSequence(driver).mouseDown(splitter[0], {x: 0, y: 0}).perform()
//     await new LegacyActionSequence(driver).mouseMove(modalHeader, {x: POS, y: 0}).perform() // this actually fails: does nothing on splitter
//     await new LegacyActionSequence(driver).mouseUp(modalHeader, {x: POS, y: 0}).perform() // this actually fails: does nothing on splitter
//     console.log('done')
//   } catch (error) { console.log(error) } finally { /* await driver.quit() */ }
// }

async function quitDriver (driver) {
  await driver.quit()
}

module.exports = { buildDriver, renameGroup, quitDriver }
