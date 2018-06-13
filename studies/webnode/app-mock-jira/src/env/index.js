'use strict'

const serverHost = process.env.HOST || '0.0.0.0'
const serverPort = process.env.PORT || 4545
const dockerHost = process.env.DOCKER_HOST || serverHost
const dockerPort = process.env.DOCKER_PORT || serverPort

module.exports = { serverHost, serverPort, dockerHost, dockerPort }
