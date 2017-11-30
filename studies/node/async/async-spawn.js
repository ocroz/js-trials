#!node
'use strict'

const { spawn, spawnSync } = require('child_process')

function run (cmdLine) {
  const [cmd, ...args] = cmdLine.split(' ')
  console.log(cmd, args.join(' '))
  return new Promise((resolve, reject) => {
    const res = spawn(cmd, args)
    let [stdout, stderr] = new Array(2).fill('')
    res.stdout.on('data', (data) => { stdout += data })
    res.stderr.on('data', (data) => { stderr += data })
    res.on('close', (code) => resolve({ code, stdout, stderr }))
    res.on('error', (err) => reject(err))
  })
}

function runSync (cmdLine) {
  const [cmd, ...args] = cmdLine.split(' ')
  console.log(cmd, args.join(' '))
  return (spawnSync(cmd, args))
}

async function processSpawn () {
  const cmdLine = 'p4 set'
  // async processing...
  console.log('async processing...')
  const res = await run(cmdLine)
  console.log('process:', res.stdout)
  console.log('async processing completed.')
  // sync processing...
  const resSync = runSync(cmdLine)
  console.log('process:', resSync.stdout.toString())
}

async function trycatch () {
  try {
    await processSpawn()
    console.log('async function completed, no more things to do, exiting script.')
  } catch (err) {
    console.error(`async function aborted with error '${err.message}'.`)
  }
}

console.log('launching async function...')
trycatch()
console.log('async function launched, leaving main context, giving hand to async processing.')
