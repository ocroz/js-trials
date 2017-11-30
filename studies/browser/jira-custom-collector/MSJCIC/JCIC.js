'use strict'

/* globals Confluence JIRAURL $ alert XMLHttpRequest */

// CIC constructor
function CIC (collector, project, mapfields) { // eslint-disable-line no-unused-vars
  // Check params
  if (!(collector && project && mapfields)) {
    throw new Error('CIC constructor needs a collector, a project, and a mapfields function')
  } else if (typeof mapfields !== 'function') {
    throw new Error('CIC mapfields must be a function')
  }

  // CIC static attributes
  this.collector = this.label = collector
  this.modal = collector + '-modal'
  this.project = project
  this.jira = getJira()
  if (!this.jira) {
    throw new Error('CIC constructor needs a JIRA server URL')
  }

  // CIC jira attributes
  this.user = null
  this.priorities = null
  this.issuetypes = null
  this.components = null
  this.versions = null

  // CIC methods
  this.mapfields = function () {
    return mapfields(this)
  }
  this.connect = function () {
    connect(this)
  }
  this.submit = function () {
    submit(this)
  }
  this.value = function (id, value) {
    return formvalue(this, id, value)
  }
}

// Get JIRA URL
function getJira () {
  return (
    (typeof JIRAURL !== 'undefined' && JIRAURL) ||
    (typeof Confluence !== 'undefined' && conf2jira())
  )

  function conf2jira () {
    var jiraurl = Confluence.getBaseUrl().split('/')
    jiraurl[jiraurl.length - 1] = 'jira'
    return jiraurl.join('/')
  }
}

function connect (that) {
  getUser()

  // Get user
  function getUser () {
    queryJira(setUser, that.jira)

    function setUser (response) {
      if (response.status === 'success') {
        that.user = response.data.key
        getPriorities() // next
      } else {
        console.error('CIC failed to contact JIRA ' + that.jira, response)
        showModal(
          'Please first login to JIRA server',
          '<p>Go and login at:<br /><a href="' + that.jira + '">' + that.jira + '</a></p><p>Then come back here.</p>'
        )
      }
    }
  }

  // Get priorities
  function getPriorities () {
    queryJira(setPriorities, that.jira, 'GET', 'api/2/priority')

    function setPriorities (response) {
      if (response.status === 'success') {
        that.priorities = response.data
        getProjectData() // next
      } else {
        console.error('Internal Ajax Error:', response)
        throw new Error('CIC failed to load priorities')
      }
    }
  }

  // Get issuetypes, components, and versions
  function getProjectData () {
    queryJira(setProjectData, that.jira, 'GET', 'api/2/project/' + that.project)

    function setProjectData (response) {
      if (response.status === 'success') {
        that.issuetypes = response.data.issueTypes
        that.components = response.data.components
        that.versions = response.data.versions
        show() // next
      } else {
        console.error('Internal Ajax Error:', response)
        throw new Error('CIC failed to load issuetypes, components, and versions')
      }
    }
  }

  // Show modal
  function show () {
    createModal(that)
    addJiraOptions(that)
    $('#' + that.modal).modal('show')
    $('.selectpicker').selectpicker()
  }
}

function submit (that) {
  if (mandatoryFields(that)) {
    var issue = that.mapfields()
    console.log(issue)
    sendIssue(hide, that, issue)
  }

  function hide () {
    $('#' + that.modal).modal('hide')
  }
}

function formvalue (that, id, value) {
  var element = document.querySelectorAll('#' + that.modal + ' ' + '#' + id)[0]
  if (value !== undefined) {
    element.value = value
  }
  if (element.localName !== 'div') {
    // Single value
    if (!element.multiple) {
      return element.value !== '' ? element.value : undefined
    }
    // Multiple values
    if (element.parentNode.childNodes[0].title !== element.title) {
      return element.parentNode.childNodes[0].title.split(', ')
    }
    return undefined // No  value selected
  } else {
    // Checkbox and Radio buttons
    var inputs = document.querySelectorAll('#' + that.modal + ' ' + '#' + id + ' ' + 'input')
    var type = 'checkbox'
    var values = []
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i]
      if (input.checked) {
        type = input.type
        values.push(input.value)
      }
    }
    return type === 'checkbox' ? values : values[0]
  }
}

// Check mandatory fields
function mandatoryFields (that) {
  var needValue = []
  var tags = document.querySelectorAll('#' + that.modal + ' ' + '[id][name]')
  for (var i = 0; i < tags.length; i++) {
    var tag = tags[i]
    if (tag.required) {
      if (that.value(tag.getAttribute('id')) === undefined) {
        needValue.push(tag.getAttribute('id'))
      }
    }
  }
  if (needValue.length > 0) {
    if (needValue.length === 1) {
      throw new Error('The field "' + needValue[0] + '" is required !')
    } else {
      throw new Error('The fields "' + needValue.join(', ') + '" are required !')
    }
  }
  return needValue.length === 0
}

// Send issue
function sendIssue (cb, that, issue) {
  if (!cb) { cb = null }

  issue.fields.project = {'key': that.project}
  issue.fields.labels === undefined
    ? issue.fields.labels = [that.label]
    : issue.fields.labels[issue.fields.labels.length] = that.label

  console.log('SUBMITTING ISSUE...')
  queryJira(recieveIssue, that.jira, 'POST', 'api/2/issue', issue)

  function recieveIssue (response) {
    if (response.status === 'success') {
      var issueurl = that.jira + '/browse/' + response.data.key
      console.log('ISSUE SUBMITTED:', issueurl)
      showModal(
        'New issue submitted',
        '<a href="' + issueurl + '">' + response.data.key + '</a>'
      )
      cb && cb() // next
    } else {
      console.error('Fail to submit issue:', response)
      alert(JSON.stringify(response.result))
    }
  }
}

// Generic JIRA REST function
function queryJira (cb, jiraurl, method, request, input) {
  if (!cb) { cb = null }
  if (!jiraurl) { jiraurl = 'https://atlassian-test.hq.k.grp/jira' }
  if (!method) { method = 'GET' }
  if (!request) { request = 'api/2/myself' }
  if (input) { input = JSON.stringify(input) }
  var url = jiraurl + '/rest/' + request
  var xasync = true
  console.log('BEGINNING OF REST CALL')
  var xhr = new XMLHttpRequest()
  xhr.open(method, url, xasync)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.withCredentials = true
  xhr.onload = function () {
    // console.log('onload', xhr);
    var data = null
    try {
      data = JSON.parse(xhr.response)
    } catch (err) {
      data = xhr.response
    }
    if (typeof (data) === 'object') {
      Object.keys(data).forEach(function (key) {
        if (typeof (data[key]) === 'object' && Object.keys(data[key]).length === 0) {
          delete (data[key])
        }
      })
    }
    var response = {
      status: (xhr.statusText === 'OK' || xhr.statusText === 'Created') ? 'success' : 'error', // Keep consistent status with the $.ajax method
      data: data,
      result: {status: xhr.status, statusText: xhr.statusText, data: data}
    }
    cb && cb(response)
  }
  xhr.onerror = function () {
    console.error('onerror', xhr)
  }
  xhr.onloadend = function () {
    console.log('END OF REST CALL')
  }
  xhr.send(input)
}

function createModal (that) {
  // Modal Structure
  var modal = createModalStructure(that.modal)

  // Modal Header
  addElement(modal.header, 'h4', {class: 'modal-title'}, document.getElementById(that.collector).title)

  // Modal Body
  var childNodes = document.getElementById(that.collector).childNodes
  for (var i = 1; i < childNodes.length; i += 2) {
    var childNode = childNodes[i]
    const modalBodyContent = document.createDocumentFragment()
    const modalBodyRow = addElement(modalBodyContent, 'div', {class: 'row'})
    const modalBodyColumnLeft = addElement(modalBodyRow, 'div', {class: 'col-lg-3'})
    const modalBodyColumnRight = addElement(modalBodyRow, 'div', {class: 'col-lg-6'})
    modal.body.appendChild(modalBodyContent)
    const label = childNode.getAttribute('name') || childNode.getAttribute('title')
    const required = childNode.required ? '*' : ''
    modalBodyColumnLeft.innerHTML += '<p align="right">' + label + '<span style="color:red">' + required + '<span></p>'
    const p = addElement(modalBodyColumnRight, 'p', {})
    const newNode = document.createElement(childNode.localName)
    p.appendChild(newNode)
    newNode.outerHTML = childNode.outerHTML
    if (childNode.localName !== 'div') {
      p.children[0].className = childNode.className + ' form-control'
    }
    if (childNode.localName === 'textarea' && childNode.placeholder) {
      p.children[0].value = ''
    } // Fix a bug in Internet Explorer
  }

  // Modal Footer
  addElement(modal.footer, 'button', {class: 'btn btn-link', 'data-dismiss': 'modal'}, 'Cancel')
  addElement(modal.footer, 'button', {class: 'btn btn-primary'}, 'Submit')

  // Modal Form Submit Handler
  $('#' + that.modal).submit(function () {
    that.submit()
    return false
  })
}

// Add JIRA options to the select lists
function addJiraOptions (that) {
  var selects = document.getElementById(that.modal).getElementsByTagName('select')
  var i, j, item, attributes
  for (i = 0; i < selects.length; i++) {
    var select = selects[i]
    select.className = select.className + ' selectpicker'
    var selectType = select.className.match(/jira:[^ ]*/)
    if (selectType) {
      var list = selectType[0].split(':')[1]
      if (select.options.length === 0) {
        if (!select.title) {
          select.setAttribute('title', select.getAttribute('placeholder'))
        }
        if (list === 'versions') {
          var groupUnreleased = addElement(select, 'optgroup', {label: 'Unreleased'})
          for (j = 0; j < that[list].length; j++) {
            item = that[list][j]
            if (!item.archived && !item.released) { // unarchived and unreleased
              attributes = {'data-content': item.name}
              addElement(groupUnreleased, 'option', attributes, item.name)
            }
          }
          var groupReleased = addElement(select, 'optgroup', {label: 'Released'})
          for (j = 0; j < that[list].length; j++) {
            item = that[list][j]
            if (!item.archived && item.released) { // unarchived and released
              attributes = {'data-content': item.name}
              addElement(groupReleased, 'option', attributes, item.name)
            }
          }
        } else {
          for (j = 0; j < that[list].length; j++) {
            item = that[list][j]
            attributes = {'data-content': item.name}
            if (!item.subtask) { // all but subtasks of issuetypes, no impact on priorities and components
              if ((list === 'issuetypes') || (list === 'priorities')) {
                attributes = {'data-content': '<img src="' + item.iconUrl + '" height="24px" width="24px" />&nbsp;&nbsp;' + item.name}
              }
              addElement(select, 'option', attributes, item.name)
            }
          }
        }
      }
    }
  }
}

function showModal (title, message) {
  var modalId = 'info-modal'
  var modal = createModalStructure(modalId)
  addElement(modal.header, 'h4', {class: 'modal-title'}, title)
  modal.body.innerHTML += message
  addElement(modal.footer, 'button', {class: 'btn btn-default', 'data-dismiss': 'modal'}, 'Close')
  $('#' + modalId).modal('show')
}

function createModalStructure (modalId) {
  // Remove the previous modal if any
  var modalNode = document.getElementById(modalId)
  if (modalNode) {
    modalNode.outerHTML = ''
  }

  // Create the modal structure
  var fragment = document.createDocumentFragment()
  // const container = addElement(fragment, 'div', { class: 'container' })
  var modal = addElement(fragment, 'div', {class: 'modal fade', id: modalId, role: 'dialog', 'data-backdrop': 'static', 'data-keyboard': 'false'})
  var modalDialog = addElement(modal, 'div', {class: 'modal-dialog'})
  var modalContent = addElement(modalDialog, 'div', {class: 'modal-content'})
  var modalForm = addElement(modalContent, 'form')
  // const modalFormGroup = addElement(modalForm, 'div', { class: 'form-group' });
  var modalHeader = addElement(modalForm, 'div', {class: 'modal-header'})
  addElement(modalHeader, 'button', {class: 'close', 'data-dismiss': 'modal'}, 'x')
  var modalBody = addElement(modalForm, 'div', {class: 'modal-body'})
  var modalFooter = addElement(modalForm, 'div', {class: 'modal-footer'})
  document.body.appendChild(fragment)

  // Modal nodes under which to add other elements
  return {header: modalHeader, body: modalBody, footer: modalFooter}
}

function addElement (fragment, element, attributes, text) {
  var newNode = document.createElement(element)
  for (var attribute in attributes) {
    newNode.setAttribute([attribute], attributes[attribute])
  }
  if (text) { newNode.textContent = text }
  fragment.appendChild(newNode)
  return newNode
}
