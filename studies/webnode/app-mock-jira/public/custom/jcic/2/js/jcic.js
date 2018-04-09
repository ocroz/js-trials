'use strict'

/* globals AJS JIRAURL XMLHttpRequest */

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
  this.modals = []
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
      AJS.dialog2('#' + that.modals.pop()).hide()
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
  // Modal Header, Body, Footer
  var modalTitle = document.getElementById(that.collector).title || that.collector + ' Submit Form'
  var modalBody = addFormFields()
  var modalEvents = { submit: true }

  // Show Modal
  showModal(that, modalTitle, modalBody, modalEvents)

  // Activate AUI features
  that.auiOnModalShown()

  // Modal Form Submit Handler
  $('#' + that.modal).submit(function (e) {
    e.preventDefault()
    if (!that.getAndValidateFormFieldValues()) {
      return false // The validation failed for few fields
    }
    that.submit()
    return false
  })

  // Add the Form Fields from the Collector
  function addFormFields () {
    var auiSelect2Fields = []
    var modalBody = document.createElement('div')
    var childNodes = document.getElementById(that.collector).childNodes
    for (var i = 1; i < childNodes.length; i += 2) {
      var childNode = childNodes[i]
      if (childNode.nodeName === '#comment') { continue } // Ignore HTML comments
      var fieldContent = document.createDocumentFragment()
      var fieldGroup = addElement(fieldContent, 'div', {class: 'field-group'})
      modalBody.appendChild(fieldContent)
      var label = childNode.getAttribute('name') || childNode.getAttribute('title')
      var fieldLabel = addElement(fieldGroup, 'label', {for: childNode.id}, label)
      if (childNode.hasAttribute('required')) { // .required fails on div elements
        addElement(fieldLabel, 'span', {class: 'aui-icon icon-required'}, 'required')
      }

/*
select solutions:
single/multi | optgroup | live search | image : solution
  x                                           : select without auiSelect2()
  x                           x               : select with auiSelect2() +disabled/hidden/selected option
  x                           x           x   : aui-select but with label (not aui-label) for consistency
  x               x                           : select without auiSelect2()
  x               x           x               : select with auiSelect2() +disabled/hidden/selected option
         x                                    : n/a -> must be auiSelect2() so with live search
         x                    x               : multiple=true with auiSelect2() and multi-select
         x        x                           : n/a -> must be auiSelect2() so with live search
         x        x           x               : multiple=true with auiSelect2() and multi-select
*/

      var auiSelect = false
      if (childNode.localName === 'select' && (
        childNode.classList.contains('jira:priorities') || childNode.classList.contains('jira:issuetypes')
      )) {
        auiSelect = true
      }
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
              var hidden = !(thisBrowser.isIE || thisBrowser.isEdge) ? true : null
              addElement(
                fieldGroup.children[lastNode],
                'option', {disabled: true, hidden: hidden, selected: true, value: ''}, childNode.title || childNode.placeholder,
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
    }
    addJiraOptions(modalBody)
    startAuiFeatures(that, auiSelect2Fields)
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
                    addElement(select, 'option', {id: j}, item.name)
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

// https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
var thisBrowser = {
  // Opera 8.0+
  isOpera: (!!window.opr && !!window.opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,

  // Firefox 1.0+
  isFirefox: typeof InstallTrigger !== 'undefined',

  // Safari 3.0+ "[object HTMLElementConstructor]"
  isSafari: /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === '[object SafariRemoteNotification]' })(!window['safari'] || (typeof window.safari !== 'undefined' && window.safari.pushNotification)),

  // Internet Explorer 6-11
  isIE: /* @cc_on!@ */false || !!document.documentMode,

  // Edge 20+
  isEdge: !this.isIE && !!window.StyleMedia,

  // Chrome 1+
  isChrome: !!window.chrome && !!window.chrome.webstore,

  // Blink engine detection
  isBlink: (this.isChrome || this.isOpera) && !!window.CSS
}

function startAuiFeatures (that, auiSelect2Fields) {
  // Register to onModalShown and onFormSubmit events
  that.auiOnModalShown = auiOnModalShown
  that.getAndValidateFormFieldValues = getAndValidateFormFieldValues

  // The modal is now shown
  function auiOnModalShown () {
    var elements, i

    // Fix bug for all browsers but Chrome when the select is required
    elements = AJS.$('#' + that.modal + ' select')
    for (i = 0; i < elements.length; i++) {
      elements[i].outerHTML = elements[i].outerHTML
    }

    // Activate the select2 fields
    auiSelect2Fields.forEach(function (id) {
      AJS.$('#' + that.modal + ' #' + id).auiSelect2()

      // Hide the disabled elements. A hidden/disabled/selected element is only used as placeholder.
      AJS.$('.select2-results').on('DOMNodeInserted', function (e) {
        if (e.target.classList.contains('select2-disabled')) {
          e.target.style.display = 'none'
        }
      })
    })

    // Fix for all browsers to apply the placeholder style on select elements
    // - First collect the css properties of class .placeholder into style
    var element = addElement(document.body, 'span', {class: 'placeholder'}) // temporary span for getComputedStyle()
    var style = ''
    var properties = ['background-color', 'color', 'opacity'] // +possible other styles
    for (i = 0; i < properties.length; i++) {
      style += properties[i] + ':' + window.getComputedStyle(element)[properties[i]] + '!important;'
    }
    // var border = 'border:' + window.getComputedStyle(element)['border'] + '!important;'
    document.body.removeChild(element)
    // - Secondly apply the style to the elements: multiselect.auiSelect2(), select.auiSelect2(), and select
    elements = AJS.$('.select2-default, .select2-choice, #' + that.modal + ' select[id]:not(.select2-offscreen)')
    for (i = 0; i < elements.length; i++) {
      elements[i].setAttribute(
        'style',
        (elements[i].getAttribute('style') || '') + style
        // (elements[i].getAttribute('style') || '') + (elements[i].localName === 'a' ? style + border : style)
      )
    }
    // - Then register to select focusout to toggle the style
    AJS.$('#' + that.modal + ' div.select.select2-container').focusout(function (e) {
      var select = AJS.$(this).closest('div.field-group')[0].getElementsByTagName('select')[0] // e.target.closest(element) fails on Edge and IE
      var target = AJS.$(this).closest('div.field-group')[0].getElementsByTagName('a')[0]
      select.value ? target.removeAttribute('style') : target.setAttribute('style', style)
    })
    AJS.$('#' + that.modal + ' select[id]:not(.select2-offscreen)').focusout(function (e) {
      e.target.value ? e.target.removeAttribute('style') : e.target.setAttribute('style', style)
    })

    // Fix feature for Chrome with an alternative of ms-clear in Internet Explorer and Edge
    elements = AJS.$('#' + that.modal + ' aui-select input')
    for (i = 0; i < elements.length; i++) {
      elements[i].type = 'search'
    }

    // Fix bug for Internet Explorer when the textarea has a placeholder
    // Fix bug for Firefox when the textarea is required
    elements = AJS.$('#' + that.modal + ' textarea')
    for (i = 0; i < elements.length; i++) {
      if (elements[i].placeholder) {
        elements[i].value = ''
      }
      if (thisBrowser.isFirefox) {
        elements[i].outerHTML = elements[i].outerHTML
      }
    }

    // Fixes that need the new DOM at the next tick
    window.setTimeout(function () {
      // Fix bug for all browsers but Chrome when the aui-select is required
      elements = AJS.$('#' + that.modal + ' aui-select')
      for (i = 0; i < elements.length; i++) {
        elements[i].parentNode.getElementsByTagName('input')[0].required =
          AJS.$('#' + that.collector + ' #' + elements[i].id)[0].required
      }

      // Fix bug for Internet Explorer and Safari when the selected image is too big
      if (thisBrowser.isIE || thisBrowser.isSafari) {
        AJS.$('#' + that.modal + ' aui-select input').focusout(function (e) {
          !e.target.style['background-size'] && e.target.setAttribute('style', e.target.getAttribute('style') + '; background-size: 16px 16px;')
        })
      }

      // Fix bug for Internet Explorer when clicking on aui-select button and aui-select value is empty
      AJS.$('#' + that.modal + ' aui-select button').on('click', function (e) {
        window.setTimeout(function () {
          e.target.parentNode.getElementsByTagName('input')[0].click()
        }, 1)
      })
    }, 1)
  }

  // The form is being submitted
  function getAndValidateFormFieldValues () {
    getFieldValues()
    return formValidation()

    function getFieldValues () {
      var elements = AJS.$('#' + that.modal + ' [id]')
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

  function formValidation () {
    var elements, i

    // Highlight the empty required form fields that make the submit to fail
    elements = AJS.$('#' + that.modal + ' :required')
    for (i = 0; i < elements.length; i++) {
      elements[i].classList.add('form-highlights')
    }
    auiHighlights() // same for the select2 and div fields

    // Return true only if all the required fields are valued
    elements = AJS.$('#' + that.modal + ' *[required]') // :required fails on div elements
    for (i = 0; i < elements.length; i++) {
      if (!(that.value(elements[i].id) && that.value(elements[i].id).length)) {
        auiRequiredTooltip(elements[i])
        return false
      }
    }
    return true

    // Highlight the select2 and div fields
    function auiHighlights () {
      window.setTimeout(function () {
        select2ToggleClass()
        divToggleClass()
      }, 1)

      window.setTimeout(function () {
        // input is either children (multi-select) or next to div.select2-highlights (single select with live search)
        AJS.$('.select2-highlights input, .select2-highlights ~ input').focusout(function (e) {
          select2ToggleClass()
        })
      }, 1)

      function select2ToggleClass () {
        var selects = AJS.$('select.select2-offscreen:required')
        for (var i = 0; i < selects.length; i++) {
          var target = selects[i].parentNode.querySelectorAll('div a, div ul')[0]
          if (selects[i].value) {
            target.classList.remove('select2-highlights')
          } else {
            target.classList.add('select2-highlights')
          }
        }
      }

      function divToggleClass () {
        var divs = AJS.$('#' + that.modal + ' div[required]')
        for (var i = 0; i < divs.length; i++) {
          if (that.value(divs[i].id).length) {
            divs[i].classList.remove('div-highlights')
          } else {
            divs[i].classList.add('div-highlights')
          }
        }
      }
    }

    // Activate a tooltip for 3s on the first empty required field
    function auiRequiredTooltip (target) {
      var id = 'required-tooltip'
      if (!AJS.$('#' + id).length) {
        var position = target.parentNode.localName === 'aui-select' ? 'position:absolute;' : 'position:relative;'
        addElement(target.parentNode, 'a', {id: id, style: position, title: 'Please put a value for this field'})
        AJS.$('#' + id).tooltip()
        AJS.$('#' + id).trigger('mouseover')
        window.setTimeout(function () {
          AJS.$('#' + id).tooltip('destroy')
          AJS.$('#' + id).remove()
        }, 3000)
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
    addElement(modal.footer, 'button', {class: 'form-btn-hidden', 'aria-hidden': true, tabindex: -1})
    addElement(modal.footer, 'button', {class: 'aui-button aui-button-link close exit'}, 'Cancel')
    addElement(modal.footer, 'button', {class: 'aui-button aui-button-primary'}, 'Submit')
  } else if (modalEvents && modalEvents.continue) {
    // Do not exit, so remove class .exit
    addElement(modal.footer, 'button', {class: 'aui-button close'}, 'Continue')
  } else {
    // Exit on close
    addElement(modal.footer, 'button', {class: 'aui-button close exit'}, 'Close')
  }

  // Show Modal
  collectorNode.parentNode.insertBefore(modal.fragment, collectorNode)
  AJS.dialog2('#' + that.modal).show()
  that.modals.push(that.modal)

  // Modal Close Handlers
  AJS.$('.close').click(function (e) {
    e.preventDefault()
    AJS.dialog2('#' + that.modals.pop()).hide()
  })
  AJS.$('.exit').click(function (e) {
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
    var modalForm = addElement(modalContent, 'form', {class: 'aui', novalidate: true})
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
    attributes[attribute] !== null && newNode.setAttribute([attribute], attributes[attribute])
  }
  if (text) { newNode.textContent = text }
  if (beforeElement) {
    fragment.insertBefore(newNode, beforeElement)
  } else {
    fragment.appendChild(newNode)
  }
  return newNode
}
