'use strict'

const serverHost = process.env.SERVER_HOST || 'localhost'
const serverPort = process.env.SERVER_PORT || 4545
const publicHost = process.env.PUBLIC_HOST || serverHost
const publicPort = process.env.PUBLIC_PORT || serverPort

module.exports = { serverHost, serverPort, publicHost, publicPort }
