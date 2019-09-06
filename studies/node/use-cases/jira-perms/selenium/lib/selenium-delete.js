'use strict'

const { Builder, By, Key, until } = require('selenium-webdriver')

const TIMEOUT = 5000 // 5s
const URL = 'http://chx-ars-01/ARWebAdmin/'

async function buildDriver () {
  let driver = await new Builder().forBrowser('chrome').build()
  await driver.manage().window().maximize()
  return driver
}

async function deleteGroup (driver, group) {
  try {
    await driver.get(URL) // await driver.navigate().to(URL) // back() // forward() // refresh()
    await driver.findElement(By.id('ctl00_Masthead_QuickSearch1_SearchStringTextBox')).sendKeys(group, Key.chord(Key.ENTER))

    // PROBLEM: Group after group the size of the right panel increases and eats the middle area then the left panel more and more
    // Workaround: Close the right panel to make the resulted groups reachable for a longer time (it fails anyway after 300+ groups)
    const rightPane = await driver.wait(until.elementLocated(By.css('.menu-pane-right')))
    try { await rightPane.findElement(By.css('.cui-icon-angle-right')).click() } catch (error) {} // Close right panel
    await driver.wait(until.elementLocated(By.xpath(`//a[text()='${group}']/../..//td`)), TIMEOUT, `LDAP group ${group} not found, skipping ...`).click()

    // Workaround: Reopen right panel to make the actions reachable again
    await rightPane.findElement(By.css('.cui-icon-angle-left')).click() // Open right panel
    await driver.wait(until.elementLocated(By.linkText('Delete'))).click()
    await driver.wait(until.elementLocated(By.css('.cux-button--primary'))).click()
    await driver.navigate().refresh()
  } catch (error) { console.log(error) } finally { /* await driver.quit() */ }
}

async function quitDriver (driver) {
  await driver.quit()
}

module.exports = { buildDriver, deleteGroup, quitDriver }
