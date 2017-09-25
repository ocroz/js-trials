'use strict'
/* globals $ JIRAURL Confluence fetch Option */

// Throw new error and return undefined
const throwNewError = (message) => { throw new Error(message) }

// Get JIRA URL
function getJira () {
  return (
    (typeof JIRAURL !== 'undefined' && JIRAURL) ||
    (typeof Confluence !== 'undefined' && conf2jira())
  )
  function conf2jira () {
    let jiraurl = Confluence.getBaseUrl().split('/')
    jiraurl[jiraurl.length - 1] = 'jira'
    return jiraurl.join('/')
  }
}

async function fetchJira (
  jiraurl = 'https://atlassian-test.hq.k.grp/jira',
  method = 'GET', request = 'api/2/myself', input
) {
  console.log('BEGINNING OF REST CALL')
  const url = jiraurl + '/rest/' + request
  const headers = { 'Content-Type': 'application/json' }
  const [agent, mode, credentials] = [undefined, 'cors', 'include']
  const body = input && JSON.stringify(input)
  return new Promise((resolve, reject) => {
    fetch(url, {method, body, headers, mode, credentials, agent})
    .then(resp => {
      const { ok, status, statusText } = resp
      const response = { ok, status, statusText }
      if (!resp.ok) {
        reject(new Error(JSON.stringify(response)))
      } else if (resp.status === 204) { // means statusText === 'No Content'
        resolve(response)
      } else {
        resp.json().then(json =>
          resolve(json))
      }
    })
    .catch(err => reject(err))
    .then(() => console.log('END OF REST CALL'))
  })
}

// Get user
function getUser (jira) {
  return fetchJira(jira).then(data => data.key)
  .catch(() =>
    showModal(
      'Please first login to JIRA server',
      `<p>Go and login at:<br><a href="${jira}">${jira}</a></p><p>Then come back here.</p>`
    )
  )
}

// Get priorities
function getPriorities (jira) {
  return fetchJira(jira, 'GET', 'api/2/priority').then(data => data)
}

// Get Project data
async function getProjectData (jira, project) {
  return fetchJira(jira, 'GET', 'api/2/project/' + project)
  .then(({issueTypes, components, versions}) => {
    return {issueTypes, components, versions}
  })
}

// Create the Custom Issue Collector class
class CIC { // eslint-disable-line no-unused-vars
  constructor (collector, project) {
    return new Promise(async (resolve, reject) => {
      !(collector && project) && throwNewError('CIC class constructor needs both a collector and a project')
      this.collector = this.label = collector
      this.modal = `${collector}-modal`
      this.project = project
      this.jira = getJira() || throwNewError('CIC class constructor needs a JIRA server URL')
      this.user = await getUser(this.jira) || throwNewError(`CIC class constructor failed to contact JIRA (${this.jira})`)
      this.priorities = await getPriorities(this.jira)
      .catch(() => throwNewError('CIC class constructor failed to load priorities'))
      const {issueTypes, components, versions} = await getProjectData(this.jira, this.project)
      .catch(() => throwNewError('CIC class constructor failed to load issuetypes, components, and versions'))
      this.issuetypes = issueTypes
      this.components = components
      this.versions = versions
      resolve(this)
    })
  }
  show () {
    if (typeof this.mapfields !== 'function') { throw new Error('CIC mapfields is not defined. Please set it first!') }
    createModal(this)
    addJiraOptions(this)
    $(`#${this.modal}`).modal('show')
    $('.selectpicker').selectpicker()
  }
  submit () {
    console.log(this.value('addedvalue'))
    console.log(this.value('priority'))
    $(`#${this.modal}`).modal('hide')
  }
  value (id, value) {
    if (value !== undefined) { document.querySelectorAll(`#${this.modal} #${id}`)[0].value = value }
    return document.querySelectorAll(`#${this.modal} #${id}`)[0].value
  }
}

function createModal (that) {
  // Modal Structure
  const { modalHeader, modalBody, modalFooter } = createModalStructure(that.modal)

  // Modal Header
  const tagTitle = document.getElementById(that.collector).getElementsByTagName('title')
  const tagTitleValue = tagTitle.length > 0 ? tagTitle[0].innerText : `${that.collector} Submit Form`
  addElement(modalHeader, 'h4', { class: 'modal-title' }, tagTitleValue)

  // Modal Body
  for (let childNode of document.getElementById(that.collector).childNodes) {
    if (childNode.outerHTML && childNode.localName !== 'title') {
      const modalBodyContent = document.createDocumentFragment()
      const modalBodyRow = addElement(modalBodyContent, 'div', { class: 'row' })
      const modalBodyColumnLeft = addElement(modalBodyRow, 'div', { class: 'col-lg-3' })
      const modalBodyColumnRight = addElement(modalBodyRow, 'div', { class: 'col-lg-6' })
      modalBody.appendChild(modalBodyContent)
      const required = childNode.getAttribute('required') ? '*' : ''
      modalBodyColumnLeft.innerHTML += `<p align="right">${childNode.getAttribute('name')}<span style="color:red">${required}<span></p>`
      // modalBodyColumnRight.innerHTML += `<p>${childNode.outerHTML}</p>`
      const p = addElement(modalBodyColumnRight, 'p', { })
      const newNode = document.createElement(childNode.localName)
      for (let attr of childNode.attributes) { newNode.setAttribute(attr.name, attr.value) }
      newNode.className = `${childNode.className} form-control`
      p.appendChild(newNode)
    }
  }

  // Modal Footer
  addElement(modalFooter, 'button', { class: 'btn btn-link', 'data-dismiss': 'modal' }, 'Cancel')
  addElement(modalFooter, 'button', { class: 'btn btn-primary' }, 'Submit')

  // Modal Form Submit Handler
  $(`#${that.modal}`).submit(() => {
    that.submit()
    return false
  })
}

// Add JIRA options to the select lists
function addJiraOptions (that) {
  for (let select of document.getElementById(that.modal).getElementsByTagName('select')) {
    const selectType = select.className.match('jira:[^ ]*')
    if (selectType) {
      const list = selectType[0].split(':')[1]
      if (select.options.length === 0) {
        let head = new Option(select.getAttribute('placeholder'), '')
        head.setAttribute('disabled', true)
        head.setAttribute('selected', true)
        head.setAttribute('hidden', true)
        select.options.add(head)
        if (list === 'versions') {
          addOptionGroup(select, 'Unreleased')
          for (let item of that[list]) {
            if (!item.archived && !item.released) { // unarchived and unreleased
              select.options.add(new Option(item.name))
            }
          }
          addOptionGroup(select, 'Released')
          for (let item of that[list]) {
            if (!item.archived && item.released) { // unarchived and released
              select.options.add(new Option(item.name))
            }
          }
        } else {
          for (let item of that[list]) {
            if ((list === 'issuetypes') || (list === 'priorities')) {
              select.className = `${select.className} selectpicker`
            }
            let attributes = {}
            if (!item.subtask) { // all but subtasks of issuetypes, no impact on priorities and components
              if ((list === 'issuetypes') || (list === 'priorities')) {
                attributes = { 'data-content': `<img src="${item.iconUrl}" heigth="24px" width="24px">&nbsp;&nbsp;${item.name}` }
              }
              addElement(select, 'option', attributes, item.name)
            }
          }
        }
      }
    }
  }
  function addOptionGroup (select, groupname) {
    let group = document.createElement('OPTGROUP')
    group.setAttribute('label', groupname)
    select.insertBefore(group, select.options[select.options.length])
  }
}

function showModal (title, message) {
  const modalId = 'info-modal'
  const { modalHeader, modalBody, modalFooter } = createModalStructure(modalId)
  addElement(modalHeader, 'h4', { class: 'modal-title' }, title)
  modalBody.innerHTML += message
  addElement(modalFooter, 'button', { class: 'btn btn-default', 'data-dismiss': 'modal' }, 'Close')
  $(`#${modalId}`).modal('show')
}

function createModalStructure (modalId) {
  // Remove the previous modal if any
  const modalNode = document.getElementById(modalId)
  if (modalNode) { modalNode.outerHTML = '' }

  // Create the modal structure
  const fragment = document.createDocumentFragment()
  // const container = addElement(fragment, 'div', { class: 'container' })
  const modal = addElement(fragment, 'div', { class: 'modal fade', id: modalId, role: 'dialog' })
  const modalDialog = addElement(modal, 'div', { class: 'modal-dialog' })
  const modalContent = addElement(modalDialog, 'div', { class: 'modal-content' })
  const modalForm = addElement(modalContent, 'form')
  // const modalFormGroup = addElement(modalForm, 'div', { class: 'form-group' })
  const modalHeader = addElement(modalForm, 'div', { class: 'modal-header' })
  addElement(modalHeader, 'button', { class: 'close', 'data-dismiss': 'modal' }, 'x')
  const modalBody = addElement(modalForm, 'div', { class: 'modal-body' })
  const modalFooter = addElement(modalForm, 'div', { class: 'modal-footer' })
  document.body.appendChild(fragment)

  // Modal nodes under which to add other elements
  return { modalHeader, modalBody, modalFooter }
}

function addElement (fragment, element, attributes, text) {
  const newNode = document.createElement(element)
  for (let attribute in attributes) {
    newNode.setAttribute([attribute], attributes[attribute])
  }
  if (text) { newNode.textContent = text }
  fragment.appendChild(newNode)
  return newNode
}
