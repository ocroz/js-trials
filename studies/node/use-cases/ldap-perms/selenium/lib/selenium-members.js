'use strict'

const { Builder, By, Key, until } = require('selenium-webdriver')

const TIMEOUT = 5000 // 5s
const URL = 'http://chx-ars-01/ARWebAdmin/'

async function buildDriver () {
  let driver = await new Builder().forBrowser('chrome').build()
  await driver.manage().window().maximize()
  return driver
}

async function addMembers (driver, group, members) {
  try {
    await driver.get(URL) // await driver.navigate().to(URL) // back() // forward() // refresh()
    await driver.findElement(By.id('ctl00_Masthead_QuickSearch1_SearchStringTextBox')).sendKeys(group, Key.chord(Key.ENTER))

    // Search for group then click Members then Add...
    await driver.wait(until.elementLocated(By.xpath(`//a[text()='${group}']/../..//td`)), TIMEOUT, `LDAP group ${group} not found, skipping ...`).click()
    await driver.wait(until.elementLocated(By.linkText('Members'))).click()
    await driver.wait(until.elementLocated(By.id('ctl00_ctl00_ContentPlaceHolderMain_ContentPlaceHolderSearchResult_ctl01_SearchCtrl_MemberAdd'))).click()

    // Switch to iframe once loaded and search for members
    await driver.wait(until.elementLocated(By.tagName('iframe')))
    await driver.switchTo().frame(0) // await driver.switchTo().defaultContent()
    await driver.wait(until.elementLocated(By.css('.cui-icon-check-empty'))) // Wait until iframe is fully loaded
    await driver.wait(until.elementLocated(By.css('.form-control'))).sendKeys(members, Key.chord(Key.ENTER))

    // Wait for results then select all and press OK to add members to group
    await driver.wait(() => driver.wait(until.elementsLocated(By.css('.cui-icon-check-empty'))).then(elems => elems.length > 1))
    await driver.findElement(By.css('.cui-icon-check-empty')).click() // Select all
    await driver.wait(() => driver.wait(until.elementLocated(By.id('ctl00_m_LeftButton'))).isEnabled())
    await driver.findElement(By.id('ctl00_m_LeftButton')).click() // OK

    // Switch back to main document and wait until the group is updated
    await driver.switchTo().defaultContent()
    for (let i = 0; i < 3; i++) { // Retry as element might not be attached to the page document anymore at getCssValue()
      try { await driver.wait(() => driver.findElement(By.css('.ui-dialog')).getCssValue('display').then(display => display === 'none')) } catch (error) {}
    }
  } catch (error) { console.log(error) } finally { /* await driver.quit() */ }
}

async function quitDriver (driver) {
  await driver.quit()
}

module.exports = { buildDriver, addMembers, quitDriver }
