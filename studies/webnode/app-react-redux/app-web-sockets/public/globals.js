'use strict'

/* eslint-disable no-unused-vars */

const { fetch, moment, io } = window

const { combineReducers, createStore, applyMiddleware } = window.Redux
const createLogger = window.reduxLogger
const thunkMiddleware = window.ReduxThunk.default

const { Component } = window.React
const { render } = window.ReactDOM
const { BrowserRouter, Route, Link, Switch, Redirect } = window.ReactRouterDOM
const { Provider, connect } = window.ReactRedux
const { Modal, Form, Row, Col, Button } = window.ReactBootstrap

const jiraHost = document.getElementById('jiraHost').value || 'localhost'
const jiraPort = document.getElementById('jiraPort').value || 4545
const jiraUrl = `http://${jiraHost}:${jiraPort}/jira` // we use app-mock-jira
const wsUrl = `http://${jiraHost}:${jiraPort}` // url for web-sockets with path = '/ws'
