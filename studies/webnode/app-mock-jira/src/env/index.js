'use strict'

const port = process.env.PORT || 4545
const dockerPort = process.env.DOCKER_PORT || port

module.exports = { port, dockerPort }
