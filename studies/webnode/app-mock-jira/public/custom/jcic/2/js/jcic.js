'use strict'

/* globals JIRAURL $ XMLHttpRequest */

// CIC constructor
function CIC (collector, project, mapfields, cb, cicDialog) { // eslint-disable-line no-unused-vars
  // Check params
  if (!(collector && project && mapfields)) {
    throw new Error('CIC constructor needs a collector, a project, and a mapfields function')
  } else if (typeof mapfields !== 'function') {
    throw new Error('CIC mapfields must be a function')
  }

  // CIC static attributes
  this.collector = this.label = collector
  this.modal = collector + '-modal'
  this.modals = []
  this.project = project
  this.cicDialog = cicDialog
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
        var message = '<p>Go and login at: <a href="' + that.jira + '" target="_blank">' + that.jira + '</a><br />Then come back here.</p>'
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
      window.AJS.dialog2('#' + that.modals.pop()).hide()
      that.issue = { key: response.data.key, url: issueurl }
      showMessage(that, title, message)
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
    console.error('Error on ' + method + ' ' + url, xhr)
    var data = { success: false, status: xhr.status, statusText: xhr.statusText }
    var response = { success: false, data: data }
    cb && cb(response)
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
  var auiSelect2Fields = []

  // Modal Header, Body, Footer
  var modalTitle = document.getElementById(that.collector).title || that.collector + ' Submit Form'
  var modalBody = addFormFields()
  var modalEvents = { submit: true }

  // Show Modal
  showModal(that, modalTitle, modalBody, modalEvents)

  // Modal auiSelect2 fields
  auiSelect2Fields.forEach(function (id) {
    window.AJS.$('#' + that.modal + ' #' + id).auiSelect2()

    // Hide the disabled elements. A hidden/disabled/selected element is only used as placeholder.
    window.AJS.$('.select2-results').on('DOMNodeInserted', function (e) {
      if (e.target.classList.contains('select2-disabled')) {
        e.target.style.display = 'none'
      }
    })
  })

  // Modal Form Submit Handler
  $('#' + that.modal).submit(function (e) {
    e.preventDefault()
    getFormValues()
    that.submit()
    return false
  })

  // Add the Form Fields from the Collector
  function addFormFields () {
    var modalBody = document.createElement('div')
    var childNodes = document.getElementById(that.collector).childNodes
    for (var i = 1; i < childNodes.length; i += 2) {
      var childNode = childNodes[i]
      if (childNode.nodeName === '#comment') { continue } // Ignore HTML comments
      var fieldContent = document.createDocumentFragment()
      var fieldGroup = addElement(fieldContent, 'div', {class: 'field-group'})
      modalBody.appendChild(fieldContent)
      var label = childNode.getAttribute('name') || childNode.getAttribute('title')

/*
  input/textarea: label
  select single/multi: label but aui-label for priorities and issuetypes
  radio/checkboxes: legend

select
single/multi | optgroup | live search | image : solution
  x                                           : select without auiSelect2()
  x                           x               : select with auiSelect2()
  x                           x           x   : aui-select
  x               x                           : select without auiSelect2()
  x               x           x               : multiple=false with auiSelect2() and select/multi-select plus disabled/hidden/selected option*
         x                                    : n/a
         x                    x               : multiple=true with auiSelect2() and multi-select
         x        x                           : n/a
         x        x           x               : multiple=true with auiSelect2() and multi-select

*document.getElementsByClassName('select2-match')[0].parentNode.style.display = 'none'
document.getElementsByClassName('select2-match')[0].parentNode.outerText === document.getElementById('component-id').children[0].outerText

        <label for="text-input">Summary<span class="aui-icon icon-required">required</span></label>
        <label for="textarea-id">Description</label>
        <aui-label for="issuetype-id">Issue Type:</aui-label>
        <legend>Radio buttons</legend>
*/

      var fieldLabel = null
      var auiSelect = false
      // if (childNode.localName === 'div') {
      //   fieldLabel = addElement(fieldGroup, 'legend', null, label)
      // } else
      if (childNode.localName === 'select' && (
        childNode.classList.contains('jira:priorities') || childNode.classList.contains('jira:issuetypes')
      )) {
        auiSelect = true
        fieldLabel = addElement(fieldGroup, 'aui-label', {for: childNode.id}, label)
      } else {
        fieldLabel = addElement(fieldGroup, 'label', {for: childNode.id}, label)
      }
      childNode.required && addElement(fieldLabel, 'span', {class: 'aui-icon icon-required'}, 'required')

      var newNode = document.createElement(auiSelect ? 'aui-select' : childNode.localName)
      fieldGroup.appendChild(newNode)
      newNode.outerHTML = auiSelect
        ? childNode.outerHTML.replace(/(<)select|select(>)/g, '$1aui-select$2')
        : childNode.outerHTML
      var lastNode = fieldGroup.children.length - 1
      if (childNode.localName !== 'div') {
        childNode.localName === 'input' && fieldGroup.children[lastNode].classList.add('text')
        childNode.localName === 'textarea' && fieldGroup.children[lastNode].classList.add('textarea')
        if (childNode.localName === 'select') {
          !childNode.title && fieldGroup.children[lastNode].setAttribute('title', childNode.getAttribute('placeholder'))
          !childNode.placeholder && fieldGroup.children[lastNode].setAttribute('placeholder', childNode.getAttribute('title'))

          if (fieldGroup.children[lastNode].localName === 'aui-select') {
            childNode.required && fieldGroup.children[lastNode].children[0] &&
              (fieldGroup.children[lastNode].children[0].required = true)
          } else {
            (childNode.multiple || childNode.hasAttribute('data-live-search')) && auiSelect2Fields.push(childNode.id)
            if (!childNode.multiple) {
              // placeholder option must be first
              addElement(
                fieldGroup.children[lastNode],
                'option', {disabled: true, hidden: true, selected: true, value: ''}, childNode.title || childNode.placeholder,
                fieldGroup.children[lastNode][0] // insert before first option
              )

              fieldGroup.children[lastNode].classList.add('select')
            } else {
              fieldGroup.children[lastNode].classList.add('multi-select')
            }
          }
        }
        fieldGroup.children[lastNode].classList.add('medium-long-field')
      }
      if (childNode.localName === 'textarea' && childNode.placeholder) {
        fieldGroup.children[lastNode].value = '' // Fix a bug in Internet Explorer
      }
    }
    addJiraOptions(modalBody)
    return modalBody
  }

  // Add JIRA options to the select lists
  function addJiraOptions (form) {
    var selects = form.querySelectorAll('select,aui-select')
    var i, j, item
    for (i = 0; i < selects.length; i++) {
      var select = selects[i]
      var selectType = select.className.match(/jira:[^ ]*/)
      if (selectType) {
        var list = selectType[0].split(':')[1]
        if (!select.options || select.options.length === 0 || (select.options.length === 1 && select.options[0].disabled)) {
          if (that[list]) {
            if (list === 'versions') {
              var groupUnreleased = addElement(select, 'optgroup', {label: 'Unreleased'})
              for (j = 0; j < that[list].length; j++) {
                item = that[list][j]
                if (!item.archived && !item.released) { // unarchived and unreleased
                  addElement(groupUnreleased, 'option', null, item.name)
                }
              }
              var groupReleased = addElement(select, 'optgroup', {label: 'Released'})
              for (j = 0; j < that[list].length; j++) {
                item = that[list][j]
                if (!item.archived && item.released) { // unarchived and released
                  addElement(groupReleased, 'option', null, item.name)
                }
              }
            } else {
              for (j = 0; j < that[list].length; j++) {
                item = that[list][j]
                if (!item.subtask) { // all but subtasks of issuetypes, no impact on priorities and components
                  if (list === 'issuetypes' || list === 'priorities') {
                    // Use select._datalist for Chrome only
                    addElement(select._datalist || select, 'aui-option', {'img-src': item.iconUrl}, item.name)
                  } else {
                    addElement(select, 'option', null, item.name)
                  }
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
    var i, j
    for (i = 0; i < elements.length; i++) {
      var element = elements[i]
      if (element.localName !== 'div') {
        if (!element.multiple) {
          // Single value
          that.formValues[element.id] = element.value !== '' ? element.value : undefined
        } else {
          // Multiple values
          that.formValues[element.id] = []
          var options = element.querySelectorAll('option')
          for (j = 0; j < options.length; j++) {
            options[j].selected && that.formValues[element.id].push(options[j].value)
          }
        }
      } else {
        // Checkbox and Radio buttons
        var inputs = document.querySelectorAll('#' + that.modal + ' ' + '#' + element.id + ' ' + 'input')
        var type = 'checkbox'
        var values = []
        for (j = 0; j < inputs.length; j++) {
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
  var collectorNode = document.getElementById(that.collector)
  var modal = createModalStructure(that.modal)

  // Modal Header
  addElement(modal.header, 'h4', {class: 'aui-dialog2-header-main'}, modalTitle)

  // Modal Body
  modal.body.appendChild(modalBody)

  // Modal Footer
  if (modalEvents && modalEvents.submit) {
    // Exit if cancel, or submit (Note: pressing enter on an input will select the first defined button)
    addElement(modal.footer, 'button', {class: 'form-btn-hidden submit', 'aria-hidden': true, tabindex: -1})
    addElement(modal.footer, 'button', {class: 'aui-button aui-button-link close exit'}, 'Cancel')
    addElement(modal.footer, 'button', {class: 'aui-button aui-button-primary submit'}, 'Submit')
  } else if (modalEvents && modalEvents.continue) {
    // Do not exit, so remove class .exit
    addElement(modal.footer, 'button', {class: 'aui-button close'}, 'Continue')
  } else {
    // Exit on close
    addElement(modal.footer, 'button', {class: 'aui-button close exit'}, 'Close')
  }

  // Show Modal
  collectorNode.parentNode.insertBefore(modal.fragment, collectorNode)
  window.AJS.dialog2('#' + that.modal).show()
  that.modals.push(that.modal)

  // Fix bug for all browsers but Chrome when the select is required
  var elements = window.AJS.$('#' + that.modal + ' select')
  for (var i = 0; i < elements.length; i++) {
    elements[i].outerHTML = elements[i].outerHTML
  }

  // Fix bug for firefox when the textarea is required
  if (typeof InstallTrigger !== 'undefined') { // Browser is Firefox
    elements = window.AJS.$('#' + that.modal + ' textarea')
    for (var i = 0; i < elements.length; i++) {
      elements[i].outerHTML = elements[i].outerHTML
    }
  }

  // Fixes that need the new DOM at the next tick
  window.setTimeout(function () {
    // Fix bug for all browsers but Chrome when the aui-select is required
    var auiSelects = window.AJS.$('#' + that.modal + ' aui-select')
    for (var i = 0; i < auiSelects.length; i++) {
      auiSelects[i].parentNode.getElementsByTagName('input')[0].required =
        window.AJS.$('#' + that.collector + ' #' + auiSelects[i].id)[0].required
    }

    // Fix bug for Internet Explorer when clicking on aui-select button and aui-select value is empty
    window.AJS.$('#' + that.modal + ' aui-select button').on('click', function (e) {
      window.setTimeout(function () {
        e.target.parentNode.getElementsByTagName('input')[0].click()
      }, 1)
    })
  }, 1)

  // Fixes that fire on submit
  $('.submit').click(function (e) {
    // Fix feature for Chrome to highlight the empty required form fields that make the submit to fail
    // https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
    if (!!window.chrome && !!window.chrome.webstore) { // Browser is Chrome
      var requiredFields = window.AJS.$('#' + that.modal + ' :required')
      for (var i = 0; i < requiredFields.length; i++) {
        requiredFields[i].classList.add('form-highlights')
      }
    }

    // Fix for all browsers when the aui-select is required
    window.setTimeout(function () {
      auiSelectHighlights()
    }, 1)
    window.setTimeout(function () {
      $('.aui-select-highlights input, .aui-select-highlights ~ input').focusout(function (e) {
        auiSelectHighlights()
      })
    }, 1)
    function auiSelectHighlights () {
      var selects = $('select.select2-offscreen:required')
      for (var i = 0; i < selects.length; i++) {
        var targets=selects[i].parentNode.querySelectorAll('div a, div ul')
        for (var j = 0; j < selects.length; j++) {
          if (targets[j]) {
            selects[i].value
              ? (targets[j].classList.remove('aui-select-highlights'))
              : (targets[j].classList.add('aui-select-highlights'))
          }
        }
      }
    }
  })

  // Modal Close Handlers
  $('.close').click(function (e) {
    e.preventDefault()
    window.AJS.dialog2('#' + that.modals.pop()).hide()
  })
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
    var modalContent = addElement(modalFragment, 'section', {class: 'aui-layer aui-dialog2 aui-dialog2-medium', id: modalId, 'aria-hidden': true, 'data-aui-modal': true, role: 'dialog'})
    var modalForm = addElement(modalContent, 'form', {class: 'aui'})
    var modalHeader = addElement(modalForm, 'div', {class: 'aui-dialog2-header'})
    var modalBody = addElement(modalForm, 'div', {class: 'aui-dialog2-content'})
    var modalFooter = addElement(modalForm, 'div', {class: 'aui-dialog2-footer'})
    var modalActions = addElement(modalFooter, 'div', {class: 'aui-dialog2-footer-actions'})

    // Modal nodes under which to add other elements
    return {fragment: modalFragment, form: modalForm, header: modalHeader, body: modalBody, footer: modalActions}
  }
}

// Add Element
function addElement (fragment, element, attributes, text, beforeElement) {
  var newNode = document.createElement(element)
  for (var attribute in attributes) {
    newNode.setAttribute([attribute], attributes[attribute])
  }
  if (text) { newNode.textContent = text }
  beforeElement ? (fragment.insertBefore(newNode, beforeElement)) : (fragment.appendChild(newNode))
  return newNode
}
