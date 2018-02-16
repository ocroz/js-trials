'use strict'

/* globals JIRAURL $ XMLHttpRequest */

// CIC load iframe (ran within parent of iframe)
function loadCIC (cicHtml, cicIframe) { // eslint-disable-line no-unused-vars
  if (!cicHtml) { throw new Error('loadCIC() needs a cicHtml file URL') }
  if (!cicIframe) { throw new Error('loadCIC() needs a cicIframe element') }

  var xhr = new XMLHttpRequest()
  xhr.open('GET', cicHtml, true)
  xhr.onload = function () {
    var html = xhr.response
    var d = $('#' + cicIframe)[0].contentWindow.document; d.open(); d.write(html); d.close()
  }
  xhr.send()
}

// CIC render from parent iframe (ran within iframe)
function renderCIC (cicDialog, cicFunction) { // eslint-disable-line no-unused-vars
  if (!cicDialog) { throw new Error('renderCIC() needs a cicDialog element') }
  if (!cicFunction) { throw new Error('renderCIC() needs a cicFunction function') }

  function showDialog () { // eslint-disable-line no-unused-vars
    // monitorEvents($('#createBasicFrm')[0].contentWindow.document.body)
    if (window.parent.AJS) {
      // Confluence dialog
      window.parent.AJS.dialog2('#' + cicDialog).show()
      window[cicFunction](hideDialog) // setTimeout(function () { fn() }, DELAY)
    } else {
      // Bootstrap dialog
      window.parent.$('#' + cicDialog).modal('show')
      window.parent.$(window.parent.document).ready(function () { window[cicFunction](hideDialog) })
    }
  }
  function hideDialog () {
    if (window.parent.AJS) {
      window.parent.AJS.dialog2('#' + cicDialog).hide()
    } else {
      window.parent.$('#' + cicDialog).modal('hide')
    }
  }
  showDialog()
}

// CIC constructor
function CIC (collector, project, mapfields, cb) { // eslint-disable-line no-unused-vars
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
  this.formValues = {}
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
  this.value = function (id) {
    return this.formValues[id]
  }
  this.exit = function () {
    cb && cb(this.issue)
  }
}

// Get JIRA URL
function getJira () {
  return (
    (typeof JIRAURL !== 'undefined' && JIRAURL) ||
    (typeof window.parent.Confluence !== 'undefined' && conf2jira()) ||
    window.location.origin + '/jira' // pure guess
  )

  function conf2jira () {
    var jiraurl = window.parent.Confluence.getBaseUrl().split('/')
    jiraurl[jiraurl.length - 1] = 'jira'
    return jiraurl.join('/')
  }
}

function connect (that) {
  getUser()

  // Get user
  function getUser () {
    xhrJira(setUser, that.jira)

    function setUser (response) {
      if (response.success) {
        that.user = response.data.key
        getPriorities() // next
      } else {
        console.error('CIC failed to contact JIRA ' + that.jira, response.data)
        var title = 'Please first login to JIRA server'
        var message = '<p>Go and login at:<br /><a href="' + that.jira + '">' + that.jira + '</a></p><p>Then come back here.</p>'
        showMessage(that, title, message)
      }
    }
  }

  // Get priorities
  function getPriorities () {
    xhrJira(setPriorities, that.jira, 'GET', 'api/2/priority')

    function setPriorities (response) {
      if (response.success) {
        that.priorities = response.data
        getProjectData() // next
      } else {
        console.error('Internal HTTP Error:', response.data)
        throw new Error('CIC failed to load priorities')
      }
    }
  }

  // Get issuetypes, components, and versions
  function getProjectData () {
    xhrJira(setProjectData, that.jira, 'GET', 'api/2/project/' + that.project)

    function setProjectData (response) {
      if (response.success) {
        that.issuetypes = response.data.issueTypes
        that.components = response.data.components
        that.versions = response.data.versions
        showForm(that) // next
      } else {
        console.error('Internal HTTP Error:', response.data)
        throw new Error('CIC failed to load issuetypes, components, and versions')
      }
    }
  }
}

function submit (that) {
  // We go here only when all required fields are valued within the html form
  console.log(that)
  var issue = that.mapfields()
  console.log(issue)

  // Send issue
  issue.fields.project = {'key': that.project}
  issue.fields.labels === undefined
    ? issue.fields.labels = [that.label]
    : issue.fields.labels[issue.fields.labels.length] = that.label

  console.log('SUBMITTING ISSUE...')
  xhrJira(recieveIssue, that.jira, 'POST', 'api/2/issue', issue)

  function recieveIssue (response) {
    if (response.success) {
      var issueurl = that.jira + '/browse/' + response.data.key
      var title = 'New issue submitted'
      var message = '<a href="' + issueurl + '">' + response.data.key + '</a>'
      console.log('ISSUE SUBMITTED:', issueurl)
      $('#' + that.modal).modal('hide')
      showMessage(that, title, message)
      that.issue = { key: response.data.key, url: issueurl }
    } else {
      console.error('Fail to submit issue:', response.data)
      // alert(JSON.stringify(response.data))
      var modal = that.modal
      that.modal += '-error'
      showMessage(that, 'Fail to submit issue', JSON.stringify(response.data), 'continue') // Do not exit, so continue
      that.modal = modal
    }
  }
}

// Generic JIRA REST function
function xhrJira (cb, jiraurl, method, request, input) {
  if (!cb) { cb = null }
  if (!jiraurl) { throw new Error('jiraurl is undefined') }
  if (!method) { method = 'GET' }
  if (!request) { request = 'api/2/myself' }

  // xhr parameters
  var url = jiraurl + '/rest/' + request
  var body = input && JSON.stringify(input)
  var xasync = true

  // xhr request
  console.log('BEGINNING OF REST CALL')
  var xhr = new XMLHttpRequest()
  xhr.open(method, url, xasync)
  xhr.setRequestHeader('Accept', 'application/json')
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.withCredentials = true
  xhr.onload = function () {
    var success = (xhr.status >= 200 && xhr.status < 300)
    var data = null
    try {
      data = JSON.parse(xhr.response)
    } catch (err) {
      data = { success: success, status: xhr.status, statusText: xhr.statusText }
    }
    if (typeof (data) === 'object') {
      Object.keys(data).forEach(function (key) {
        if (typeof (data[key]) === 'object' && Object.keys(data[key]).length === 0) {
          delete (data[key])
        }
      })
    }
    var response = { success: success, data: data }
    cb && cb(response)
  }
  xhr.onerror = function () {
    console.error('onerror', xhr)
  }
  xhr.onloadend = function () {
    console.log('END OF REST CALL')
  }
  xhr.send(body)
}

function showMessage (that, title, message, event) {
  // modalTitle, modalEvents
  var modalTitle = title
  var modalEvents = null
  if (event) {
    modalEvents = {}
    modalEvents[event] = true
  }

  // modalBody
  var fragment = document.createDocumentFragment()
  var modalBody = addElement(fragment, 'div')
  modalBody.innerHTML += message

  // Show Modal
  showModal(that, modalTitle, modalBody, modalEvents)
}

function showForm (that) {
  // Modal Header, Body, Footer
  var modalTitle = document.getElementById(that.collector).title || that.collector + ' Submit Form'
  var modalBody = addFormFields()
  var modalEvents = { submit: true }

  // Show Modal
  showModal(that, modalTitle, modalBody, modalEvents)

  // Modal Form Submit Handler
  $('#' + that.modal).submit(function (e) {
    e.preventDefault()
    getFormValues()
    that.submit()
    return false
  })

  // Apply .selectpicker() to the select lists
  $('.selectpicker').selectpicker()

  // Add the Form Fields from the Collector
  function addFormFields () {
    var modalBody = document.createElement('div')
    var childNodes = document.getElementById(that.collector).childNodes
    for (var i = 1; i < childNodes.length; i += 2) {
      var childNode = childNodes[i]
      if (childNode.nodeName === '#comment') { continue } // Ignore HTML comments
      var modalBodyContent = document.createDocumentFragment()
      var modalBodyRow = addElement(modalBodyContent, 'div', {class: 'row'})
      var modalBodyColumnLeft = addElement(modalBodyRow, 'div', {class: 'col-lg-3 col-md-3 col-sm-3 col-xs-3'})
      var modalBodyColumnRight = addElement(modalBodyRow, 'div', {class: 'col-lg-8 col-md-8 col-sm-8 col-xs-8'})
      modalBody.appendChild(modalBodyContent)
      var label = childNode.getAttribute('name') || childNode.getAttribute('title')
      var required = childNode.required ? '*' : ''
      modalBodyColumnLeft.innerHTML += '<p align="right">' + label + '<span style="color:red">' + required + '<span></p>'
      var p = addElement(modalBodyColumnRight, 'p', {})
      var newNode = document.createElement(childNode.localName)
      p.appendChild(newNode)
      newNode.outerHTML = childNode.outerHTML
      if (childNode.localName !== 'div') {
        p.children[0].className = childNode.className + ' form-control'
      }
      if (childNode.localName === 'textarea' && childNode.placeholder) {
        p.children[0].value = ''
      } // Fix a bug in Internet Explorer
    }
    addJiraOptions(modalBody)
    return modalBody
  }

  // Add JIRA options to the select lists
  function addJiraOptions (form) {
    var selects = form.getElementsByTagName('select')
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
          if (that[list]) {
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
  }

  // Get form values
  function getFormValues () {
    var elements = $('#' + that.modal + ' [id]')
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i]
      if (element.localName !== 'div') {
        if (!element.multiple) {
          // Single value
          that.formValues[element.id] = element.value !== '' ? element.value : undefined
        } else if (element.parentNode.childNodes[0].title !== element.title) {
          // Multiple values
          that.formValues[element.id] = element.parentNode.childNodes[0].title.split(', ')
        } else {
          // No  value selected
          that.formValues[element.id] = undefined
        }
      } else {
        // Checkbox and Radio buttons
        var inputs = document.querySelectorAll('#' + that.modal + ' ' + '#' + element.id + ' ' + 'input')
        var type = 'checkbox'
        var values = []
        for (var j = 0; j < inputs.length; j++) {
          var input = inputs[j]
          if (input.checked) {
            type = input.type
            values.push(input.value)
          }
        }
        that.formValues[element.id] = type === 'checkbox' ? values : values[0]
      }
    }
  }
}

function showModal (that, modalTitle, modalBody, modalEvents) {
  var modal = createModalStructure(that.modal)

  // Modal Header
  addElement(modal.header, 'h4', {class: 'modal-title'}, modalTitle)

  // Modal Body
  modal.body.appendChild(modalBody)

  // Modal Footer
  if (modalEvents && modalEvents.submit) {
    // Exit if cancel, or submit
    addElement(modal.footer, 'button', {class: 'btn btn-link exit', 'data-dismiss': 'modal'}, 'Cancel')
    addElement(modal.footer, 'button', {class: 'btn btn-primary'}, 'Submit')
  } else if (modalEvents && modalEvents.continue) {
    // Do not exit, so remove class .exit
    addElement(modal.footer, 'button', {class: 'btn btn-default', 'data-dismiss': 'modal'}, 'Continue')
  } else {
    // Exit on close
    addElement(modal.footer, 'button', {class: 'btn btn-default exit', 'data-dismiss': 'modal'}, 'Close')
  }

  // Show Modal
  document.getElementById(that.collector).parentNode.appendChild(modal.fragment)
  $('#' + that.modal).modal('show')

  // Modal Close Handler
  $('.exit').click(function (e) {
    that.exit()
  })

  // Modal Structure
  function createModalStructure (modalId) {
    // Remove the previous modal if any
    var modalNode = document.getElementById(modalId)
    if (modalNode) {
      modalNode.outerHTML = ''
    }

    // Create the modal structure
    var modalFragment = document.createDocumentFragment()
    // const container = addElement(modalFragment, 'div', { class: 'container' })
    var modal = addElement(modalFragment, 'div', {class: 'modal fade', id: modalId, role: 'dialog', 'data-backdrop': 'static', 'data-keyboard': 'false'})
    var modalDialog = addElement(modal, 'div', {class: 'modal-dialog'})
    var modalContent = addElement(modalDialog, 'div', {class: 'modal-content'})
    var modalForm = addElement(modalContent, 'form', {action: 'javascript:void(0)'})
    // const modalFormGroup = addElement(modalForm, 'div', { class: 'form-group' });
    var modalHeader = addElement(modalForm, 'div', {class: 'modal-header'})
    addElement(modalHeader, 'button', {class: 'close exit', 'data-dismiss': 'modal'}, 'x')
    var modalBody = addElement(modalForm, 'div', {class: 'modal-body'})
    var modalFooter = addElement(modalForm, 'div', {class: 'modal-footer'})

    // Modal nodes under which to add other elements
    return {fragment: modalFragment, form: modalForm, header: modalHeader, body: modalBody, footer: modalFooter}
  }
}

// Add Element
function addElement (fragment, element, attributes, text) {
  var newNode = document.createElement(element)
  for (var attribute in attributes) {
    newNode.setAttribute([attribute], attributes[attribute])
  }
  if (text) { newNode.textContent = text }
  fragment.appendChild(newNode)
  return newNode
}
