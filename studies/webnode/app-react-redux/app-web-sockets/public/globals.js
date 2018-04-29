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

const port = '4545'
const jiraUrl = `http://localhost:${port}/jira` // we use app-mock-jira
const wsUrl = `http://localhost:${port}` // url for web-sockets with path = '/ws'
