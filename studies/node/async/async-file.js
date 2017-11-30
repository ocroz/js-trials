#!node
'use strict'

const { Tail } = require('tail')
const { Buffer } = require('buffer')
const { open, write, close, createWriteStream, createReadStream } = require('fs')
const { createInterface } = require('readline')
const { Transform } = require('stream')
const through = require('through2')

function tailFile (file, stream) {
  const tail = new Tail(file)
  tail.on('line', (data) => {
    stream.write(data + '\n')
  })
  tail.on('error', (err) => {
    console.error('Tail failed with error: ', err)
    throw err
  })
  return tail
}

async function openFile (file, flags) {
  return new Promise((resolve, reject) => {
    open(file, flags, (err, fd) => {
      if (err) { reject(err) }
      resolve(fd) // File descriptor
    })
  })
}

async function writeFile (fd, line) {
  return new Promise((resolve, reject) => {
    if (line[line.length - 1] !== '\n') { line += '\n' }
    const buffer = Buffer.from(line)
    // console.log(buffer,buffer.toString())
    write(fd, buffer, (err, bytesWritten) => {
      if (err) { reject(err) }
      resolve(bytesWritten) // Number of bytes written from buffer
    })
  })
}

async function closeFile (fd) {
  return new Promise((resolve, reject) => {
    close(fd, (err) => {
      if (err) { reject(err) }
      resolve()
    })
  })
}

async function writeLines (file, options, lines) {
  return new Promise((resolve, reject) => {
    const stream = createWriteStream(file, options)
    for (let line of lines) {
      if (line[line.length - 1] !== '\n') { line += '\n' }
      stream.write(line)
    }
    stream.end('') // Emit 'finish' event
    stream.on('finish', () => {
      resolve()
    })
    stream.on('error', (err) => {
      reject(err)
    })
  })
}

async function readLines (file, output) {
  return new Promise((resolve, reject) => {
    const readLine = createInterface({
      input: createReadStream(file),
      output,
      terminal: true // terminal=true if output=process.stdout
    })
    let lines = []
    readLine.on('line', (line) => {
      lines.push(line)
    })
    readLine.on('close', () => {
      resolve(lines)
    })
    readLine.input.on('error', (err) => {
      reject(err)
    })
  })
}

function transformStream () {
  const transform = new Transform({
    transform (chunk, enc, cb) {
      if (chunk.indexOf('\n') >= 0) {
        this.push('\\t')
      }
      this.push(chunk)
      cb()
    }
  })
  return transform
}

function patchStream (buf, enc, cb) {
  if (buf.indexOf('\n') >= 0) {
    this.push('\\p')
  }
  this.push(buf)
  cb()
}

function transformTail () {
  const transform = new Transform({
    transform (chunk, enc, cb) {
      const last = chunk.indexOf('\n')
      if (last < 0) {
        this.push(chunk)
      } else {
        this.push(chunk.slice(0, last) + '\\T\n')
      }
      cb()
    }
  })
  return transform
}

function patchTail (buf, enc, cb) {
  const last = buf.indexOf('\n')
  if (last < 0) {
    this.push(buf)
  } else {
    this.push(buf.slice(0, last) + '\\P\n')
  }
  cb()
}

async function main () {
  const file = './tail.log'
  const transtail = transformTail()
  transtail
  .pipe(through(patchTail))
  .pipe(process.stdout)
  const tailer = tailFile(file, transtail) // Transform every line of file on the fly through transtail
  await timeout(1000)
  const writer = await openFile(file, 'a')
  const bytesWritten = await writeFile(writer, 'Node.JS')
  console.log('bytesWritten =', bytesWritten)
  await closeFile(writer) // Tail 'line' event emited only at file closure
  await timeout(1000)
  await writeLines(file, {}, ['Node.JS', 'C\'est cool']) // Open, Write, and Close file
  await timeout(1000)
  await writeLines(file, { flags: 'a' }, ['Append', 'lines']) // Append flag
  await timeout(1000)
  const streamer = await openFile(file, 'a')
  await writeLines(file, { fd: streamer, autoClose: false }, ['Use fd and autoClose flags']) // Don't Open and Close
  await closeFile(streamer) // Tail 'line' event emited only at file closure
  await timeout(1000)
  const appender = await openFile(file, 'a')
  await writeLines(file, { fd: appender, autoClose: false }, ['Append once']) // Don't Open and Close
  await writeLines(file, { fd: appender, autoClose: false }, ['Append twice']) // Don't Open and Close
  await closeFile(appender) // Tail 'line' event emited only at file closure
  await timeout(1000)
  tailer.unwatch() // Close tailer
  console.log('---')
  const transtream = transformStream()
  transtream
  .pipe(through(patchStream))
  .pipe(process.stdout)
  const lines = await readLines(file, transtream) // Read all the lines at once, also pipe to transtream on the fly
  console.log('---\n', lines, '\n---')
}

async function timeout (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

async function trycatch () {
  try {
    await main()
    console.log('async processes succeeded, nothing more to do, leaving script')
  } catch (err) {
    console.error('async processes failed with error:', err.message)
  }
}

console.log('launching async processes')
trycatch()
console.log('async processes launched')
