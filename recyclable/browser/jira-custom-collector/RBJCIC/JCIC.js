'use strict'
var React = window.React
var ReactDOM = window.ReactDOM
var Button = window.ReactBootstrap.Button
var Form = window.ReactBootstrap.Form
var Modal = window.ReactBootstrap.Modal
var Row = window.ReactBootstrap.Row
var Col = window.ReactBootstrap.Col
var crEl = React.createElement
var XMLHttpRequest = window.XMLHttpRequest
var $ = window.$
var alert = window.alert

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
  this.project = project
  this.jira = getJira()
  if (!this.jira) {
    throw new Error('CIC constructor needs a JIRA server URL')
  }

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
    (typeof JIRAURL !== 'undefined' && JIRAURL) || // eslint-disable-line no-undef
    (typeof Confluence !== 'undefined' && conf2jira())
  )

  function conf2jira () {
    var jiraurl = Confluence.getBaseUrl().split('/') // eslint-disable-line no-undef
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
        showMessage(
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
        showForm(that) // next
      } else {
        console.error('Internal Ajax Error:', response)
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

  // Send issue fields
  issue.fields.project = {'key': that.project}
  issue.fields.labels === undefined
    ? issue.fields.labels = [that.label]
    : issue.fields.labels[issue.fields.labels.length] = that.label

  console.log('SUBMITTING ISSUE...')
  queryJira(recieveIssue, that.jira, 'POST', 'api/2/issue', issue)

  // Recieve issue key
  function recieveIssue (response) {
    if (response.status === 'success') {
      var issueurl = that.jira + '/browse/' + response.data.key
      console.log('ISSUE SUBMITTED:', issueurl)
      showMessage( // Showing a new modal automatically hides the previous one
        'New issue submitted',
        '<a href="' + issueurl + '">' + response.data.key + '</a>'
      )
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

function formvalue (that, id, value) {
  // toArray(document.querySelectorAll('.modal select')[2].selectedOptions).map(function(opt){return opt.value})
  var element = document.querySelectorAll('.modal' + ' ' + '#' + id)[0]
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
    var inputs = document.querySelectorAll('.modal' + ' ' + '#' + id + ' ' + 'input')
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

function showMessage (title, message) {
  var modalTitle = title
  var modalBody = crEl('div', {dangerouslySetInnerHTML: {__html: message}})
  var modalFooter = null
  showModal(modalTitle, modalBody, modalFooter)
}

function showForm (that) { // eslint-disable-line no-unused-vars
  // Modal Header
  var modalTitle = document.getElementById(that.collector).title || that.collector + ' Submit Form'

  // Modal Body
  function toArray (nodeObject) {
    var array = []
    for (var i = 0; i < nodeObject.length; i++) {
      array[i] = nodeObject[i]
    }
    return array
  }

  function toObject (nodeObject) {
    var object = {}
    toArray(nodeObject).forEach(function (a) {
      var key = (a.name === 'class') ? 'className' : a.name
      var value = (a.value === '') ? true : a.value
      object[key] = value
    })
    return object
  }

  function toReact (childNode) {
    var type = childNode.localName
    var props = toObject(childNode.attributes)
    var children = null
    if (childNode.localName !== 'div') {
      props.className = props.className ? props.className + ' form-control' : 'form-control'
      if (childNode.localName === 'select') {
        if (childNode.children.length > 0) {
          children = toArray(childNode.children).map(function (child, i) {
            return crEl(child.localName, {key: i}, child.value)
          })
        } else {
          children = addJiraOptions(childNode)
        }
      }
    } else {
      if (childNode.children.length > 0) {
        props = {dangerouslySetInnerHTML: {__html: childNode.outerHTML}}
      }
    }
    return crEl(type, props, children)
  }

  function addJiraOptions (select) {
    var selectType = select.className.match(/jira:[^ ]*/)
    if (selectType) {
      var list = selectType[0].split(':')[1]
      if (list === 'versions') {
        return [
          crEl('optgroup', {key: 0, label: 'Unreleased'},
            toArray(that[list])
            .filter(function (item) { return (!item.archived && !item.released) }) // unarchived and unreleased
            .map(function (item, i) {
              return crEl('option', {key: i, 'data-content': item.name}, item.name)
            })
          ),
          crEl('optgroup', {key: 1, label: 'Released'},
            toArray(that[list])
            .filter(function (item) { return (!item.archived && item.released) }) // unarchived and released
            .map(function (item, i) {
              return crEl('option', {key: i, 'data-content': item.name}, item.name)
            })
          )
        ]
      } else {
        return (
          toArray(that[list])
          .filter(function (item) { return (!item.subtask) }) // all but subtasks of issuetypes, no impact on priorities and components
          .map(function (item, i) {
            return (
              crEl('option', {
                key: i,
                'data-content': ((list === 'issuetypes') || (list === 'priorities'))
                  ? '<img src="' + item.iconUrl + '" height="24px" width="24px" />&nbsp;&nbsp;' + item.name
                  : item.name
              }, item.name)
            )
          })
        )
      }
    }
  }

  var modalBody =
    toArray(document.getElementById(that.collector).childNodes)
    .filter(function (childNode) { return childNode.outerHTML }) // no need to filter here if toArray does it already with i+=2
    .map(function (childNode) {
      return (
        crEl(Row, {key: childNode.id},
          crEl(Col, { lg: 3 },
            crEl('p', {style: {textAlign: 'right'}}, [
              childNode.getAttribute('name') || childNode.getAttribute('title'),
              crEl('span', {key: 'redstar', style: {color: 'red'}}, childNode.required ? '*' : '')
            ])
          ),
          crEl(Col, { lg: 6 },
            toReact(childNode), crEl('p')
          )
        )
      )
    })

  // Modal Footer
  var modalFooter = { onSubmit: that.submit.bind(that) }

  showModal(modalTitle, modalBody, modalFooter)
}

function showModal (modalTitle, modalBody, modalFooter) {
  var ModalPopup = React.createClass({
    getInitialState: function () {
      return { showModal: true }
    },

    close: function () {
      this.setState({ showModal: false })
    },

    submit: function (e) {
      e.preventDefault()
      modalFooter.onSubmit()
    },

    componentDidMount: function () {
      setSelectPicker()
    },

    render: function () {
      return (
        crEl('div', null,
          crEl(Modal, { show: this.state.showModal, onHide: this.close, 'backdrop': 'static', 'keyboard': false },
            crEl(Form, {onSubmit: this.submit},
              crEl(Modal.Header, { closeButton: true },
                crEl(Modal.Title, null, modalTitle)
              ),
              crEl(Modal.Body, null,
                modalBody
              ),
              crEl(Modal.Footer, null,
                crEl(Button, { bsStyle: 'link', onClick: this.close }, 'Close'),
                modalFooter && modalFooter.onSubmit &&
                  crEl(Button, { bsStyle: 'primary', type: 'submit' }, 'Submit')
              )
            )
          )
        )
      )
    }
  })

  ReactDOM.render(crEl(ModalPopup), document.getElementById('root'))
}

function setSelectPicker () {
  main()

  function parentDiv (element) {
    return element.parentNode.localName === 'div' ? element.parentNode : parentDiv(element.parentNode)
  }

  function hasParentButton (element) {
    return element === document ? false
      : element.localName === 'button' ? true
      : hasParentButton(element.parentNode)
  }

  function toggleSelect (event) {
    var toggleDiv = parentDiv(event.target)
    closeOtherSelects(toggleDiv)
    toggleDiv.classList.toggle('open')
  }

  function closeAllSelects (event) {
    if (!hasParentButton(event.target)) {
      var modalSelects = document.querySelectorAll('.modal select')
      for (var i = 0; i < modalSelects.length; i++) {
        parentDiv(modalSelects[i]).classList.remove('open')
      }
    }
  }

  function closeOtherSelects (toggleDiv) {
    var modalSelects = document.querySelectorAll('.modal select')
    for (var i = 0; i < modalSelects.length; i++) {
      var currentDiv = parentDiv(modalSelects[i])
      if (currentDiv !== toggleDiv) {
        currentDiv.classList.remove('open')
      }
    }
  }

  function main () {
    var i = 0

    // Add the class selectpicker from bootstrap-select to all select items in the modal
    var modalSelects = document.querySelectorAll('.modal select')
    for (i = 0; i < modalSelects.length; i++) {
      modalSelects[i].classList.add('selectpicker')
    }

    // Create the dropdowns related to the select items in the modal
    $('.selectpicker').selectpicker()

    // Add the onclick method to the buttons created by selectpicker
    modalSelects = document.querySelectorAll('.modal select')
    for (i = 0; i < modalSelects.length; i++) {
      modalSelects[i].parentNode.children[0].onclick = toggleSelect
    }

    // Add a global event listener to close all selects when clicking anywhere else
    document.getElementsByClassName('modal')[0].addEventListener('click', closeAllSelects, false)
  }
}
