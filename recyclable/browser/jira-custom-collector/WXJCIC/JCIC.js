'use strict'

/* globals Confluence JIRAURL */

var webix = window.webix
var XMLHttpRequest = window.XMLHttpRequest
var $$ = window.$$
var alert = window.alert

// Show CIC buttons and disclaimer
function showCicButtons (cicButtons) { // eslint-disable-line no-unused-vars
  webix.ready(function () {
    webix.ui({
      container: 'root',
      type: 'line',
      rows: [
        { borderless: true, body: { cols: cicButtons } }
      ]
    })
  })
}

// CIC constructor
function CIC (collector, project, formelems, mapfields) { // eslint-disable-line no-unused-vars
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
  this.formelems = formelems
  this.formValues = {}
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
  this.submit = function (form) {
    submit(this, form)
  }
  this.value = function (id) {
    return this.formValues[id]
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

function submit (that, form) {
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
      form.hide()
      showMessage(
        'New issue submitted',
        '<p style="padding: 20px"><a href="' + issueurl + '">' + response.data.key + '</a></p>'
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

function showMessage (title, message) {
  webix.ui({
    view: 'window',
    id: 'modal',
    width: 600,
    height: 210,
    position: 'center',
    modal: true,
    head: title,
    body: {
      rows: [
        {
          padding: 5,
          cols: [
            { view: 'template', template: message }
          ]
        },
        {
          view: 'button',
          value: 'Close',
          click: function () {
            this.getTopParentView().hide() // hide window
          }
        }
      ]
    }
  })

  $$('modal').show()
}

function showForm (that) {
  // Add JIRA Options
  for (var i = 0; i < that.formelems.length; i++) {
    var selectType = that.formelems[i].css && that.formelems[i].css.match(/jira:[^ ]*/)
    if (selectType) {
      var list = selectType[0].split(':')[1]
      if (list === 'versions') {
        var unreleasedVersions = that.versions.filter(function (version) {
          return (!version.archived && !version.released)
        }).map(function (selected) {
          return { id: selected.name, value: selected.name }
        })
        var releasedVersions = that.versions.filter(function (version) {
          return (!version.archived && version.released)
        }).map(function (selected) {
          return { id: selected.name, value: selected.name }
        })
        var unreleasedVersionsGroup = unreleasedVersions.length > 0 ? [ {id: 1, value: 'Unreleased', data: unreleasedVersions} ] : []
        var releasedVersionsGroup = releasedVersions.length > 0 ? [ {id: 2, value: 'Released', data: releasedVersions} ] : []
        var versions = unreleasedVersionsGroup.concat(releasedVersionsGroup)
        that.formelems[i] = Object.assign(that.formelems[i], {
          view: 'richselect',
          options: {
            view: 'treesuggest',
            height: 260,
            data: versions
          }
        })
      } else {
        that.formelems[i].options = {
          body: {
            data: that[list].filter(function (item) {
              return (!item.subtask) // all but subtasks of issuetypes, no impact on priorities and components
            }).map(function (item) {
              var value = item.name
              if ((list === 'issuetypes') || (list === 'priorities')) {
                value =
                  '<img style="position:relative; top:3px; left:-1px;" src="' + item.iconUrl + '" height="24px" width="24px" />' +
                  '<span style="position:relative; top:-5px; left:5px;">' + item.name + '</span>'
              }
              return {id: item.name, value: value}
            })
          }
        }
      }
    }
  }

  webix.protoUI({
    name: 'treesuggest',
    defaults: {
      type: 'tree',
      width: 0,
      body: {
        borderless: true,
        select: true,
        template: function (obj, common) {
          return '<span>' + (obj.$count ? '<b>' + obj.value + '</b>' : obj.value) + '</span>'
        },
        ready: function () {
          this.openAll()
        },
        on: {
          onAfterSelect: function (id, e) {
            if (this.getItem(id).$count) {
              this.getParentView().setMasterValue('')
              this.show($$(this.getParentView().config.master).getInputNode())
            }
          }
        }
      }
    }
  }, webix.ui.suggest)

  var formelems = that.formelems.concat({
    cols: [
      { view: 'button',
        value: 'Cancel',
        click: function () {
          this.getTopParentView().hide() // hide window
        }},
      { view: 'button',
        type: 'form',
        value: 'Submit',
        click: onSubmit}
    ]
  })

  function onSubmit () {
    var formValues = $$(that.modal).getValues()
    if (this.getFormView().validate()) { // validate form
      Object.keys(formValues).forEach(function (id) {
        var matchId = id.match(/.*-.*/)
        if (matchId) {
          var shortId = matchId[0].split('-')[0]
          if (formValues[id]) { // Only keep checked checkboxes
            var formValue = $$(id).data['label']
            if (!that.formValues[shortId]) {
              that.formValues[shortId] = [formValue]
            } else {
              that.formValues[shortId][that.formValues[shortId].length] = formValue
            }
          }
        } else {
          var matchValue = formValues[id].match(/.*,.*/)
          if (matchValue) {
            that.formValues[id] = formValues[id].split(',')
          } else {
            that.formValues[id] = formValues[id]
          }
        }
      })
      that.submit(this.getTopParentView())
    } else {
      webix.message({ type: 'error', text: 'Form data is invalid' })
    }
  }

  var modalTitle = that.collector + ' Submit Form'

  var form = {
    view: 'form',
    id: that.modal,
    borderless: true,
    rows: formelems
  }

  webix.ui({
    view: 'window',
    id: 'modal',
    width: 600,
    position: 'center',
    modal: true,
    head: modalTitle,
    body: webix.copy(form)
  })

  function showModal (id) {
    $$(id).getBody().clear()
    $$(id).show()
    $$(id).getBody().focus()
  }

  showModal('modal')
}
