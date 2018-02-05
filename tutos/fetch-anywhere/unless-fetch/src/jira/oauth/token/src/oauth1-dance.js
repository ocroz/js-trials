// https://devup.co/jira-rest-api-oauth-authentication-in-node-js-2f8d226a493a
// https://github.com/lianboi/jira-node-oauth

'use strict'

const express = require('express')
const session = require('express-session')
const OAuth = require('oauth').OAuth

function createOAuth1Token (port, jiraUrl, consumerKey, consumerSecret) {
  // console.log(port, jiraUrl, consumerKey, consumerSecret.toString('utf8'))
  const app = express()
  const localUrl = 'http://localhost:' + port

  app.use(session({ secret: 'red', saveUninitialized: true, resave: true }))

  app.get('/', (req, res) => res.send('Hello World!'))

  app.get('/jira', function (req, res) {
    const oa = new OAuth(
      jiraUrl + '/plugins/servlet/oauth/request-token', // request token
      jiraUrl + '/plugins/servlet/oauth/access-token', // access token
      consumerKey, // consumer key
      consumerSecret, // consumer secret, eg. fs.readFileSync('jira.pem', 'utf8')
      '1.0', // OAuth version
      localUrl + '/jira/callback', // callback url
      'RSA-SHA1'
    )
    oa.getOAuthRequestToken(function (error, oauthToken, oauthTokenSecret) {
      if (error) {
        console.log('Error:', error)
        res.send('STEP 1: Error requesting OAuth access token')
      } else {
        req.session.oa = oa
        req.session.oauth_token = oauthToken
        req.session.oauth_token_secret = oauthTokenSecret
        return res.redirect(jiraUrl + '/plugins/servlet/oauth/authorize?oauth_token=' + oauthToken)
      }
    })
  })

  app.get('/jira/callback', function (req, res) {
    if (req.query.oauth_verifier === 'denied') {
      console.log('Error:', {'oauth_verifier': 'denied'})
      return res.send('STEP 2: Error authorizing OAuth access token')
    }
    const oa = new OAuth(
      req.session.oa._requestUrl,
      req.session.oa._accessUrl,
      req.session.oa._consumerKey,
      consumerSecret, // consumer secret, eg. fs.readFileSync('jira.pem', 'utf8')
      req.session.oa._version,
      req.session.oa._authorize_callback,
      req.session.oa._signatureMethod
    )

    oa.getOAuthAccessToken(
      req.session.oauth_token,
      req.session.oauth_token_secret,
      req.query.oauth_verifier, // req.param('oauth_verifier')
      function (error, oauthAccessToken, oauthAccessTokenSecret, results2) {
        if (error) {
          console.log('Error:', error)
          res.send('STEP 3: Error accessing OAuth access token')
        } else {
          // store the access token in the session
          req.session.oauth_access_token = oauthAccessToken
          req.session.oauth_access_token_secret = oauthAccessTokenSecret

          res.send({
            message: 'successfully authenticated.',
            access_token: oauthAccessToken,
            secret: oauthAccessTokenSecret
          })
        }
      })
  })

  app.listen(port, () => console.log(`Local app listening at ${localUrl}`))
}

module.exports = { createOAuth1Token }
