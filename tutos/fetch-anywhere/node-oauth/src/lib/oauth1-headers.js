'use strict'

const OAuth = require('oauth').OAuth

function getOAuth1Header (url, method, consumerAppKey, consumerPrivateKey, oauthToken, oauthTokenSecret) {
  const [requestUrl, accessUrl, authorizeCallback] = [null, null, null] // useless with oauthToken and oauthTokenSecret
  const [consumerKey, consumerSecret] = [consumerAppKey, consumerPrivateKey]
  const [oauthVersion, signatureMethod] = ['1.0', 'RSA-SHA1'] // hardcoded values
  const [nonceSize, customHeaders] = [null, null] // unused values

  const oauthHeader = new OAuth(
    requestUrl,
    accessUrl,
    consumerKey,
    consumerSecret,
    oauthVersion,
    authorizeCallback,
    signatureMethod,
    nonceSize,
    customHeaders
  )
  .authHeader(
    url,
    oauthToken,
    oauthTokenSecret,
    method
  )
  return oauthHeader
}

module.exports = { getOAuth1Header }
