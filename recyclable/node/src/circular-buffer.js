#!node
'use strict'

const { Buffer } = require('buffer')

class Readline {
  constructor (length) {
    this.length = length
    this.buf = Buffer.alloc(this.length).fill(0)
    this.enc = 'utf8'
    this.writePos = 0
    this.readPos = 0
    this.lastIsWrite = false
  }
  get capacity () {
    let capacity = 0
    if (this.readPos === this.writePos) {
      capacity = this.lastIsWrite ? 0 : this.length
    } else {
      capacity = this.readPos - this.writePos
      if (capacity < 0) { capacity += this.length }
    }
    // console.log('capacity():',capacity,'readPos=',this.readPos,'writePos=',this.writePos,'lastIsWrite=',this.lastIsWrite,'length=',this.length)
    return capacity
  }
  write (str) {
    // console.log('\nwrite(\'',str.replace(/\n/g,'\\n'),'\')')
    if (str.length > this.capacity) {
      return 0
    }
    // console.log('str.length:',str.length,'Writting...')
    let nbWritten1 = this.buf.write(str, this.writePos)
    let nbWritten2 = 0
    if (nbWritten1 < str.length) {
      nbWritten2 = this.buf.write(str.substring(nbWritten1), 0)
    }
    this.writePos = nbWritten2 === 0 ? this.writePos + nbWritten1 : nbWritten2
    this.lastIsWrite = (nbWritten1 + nbWritten2 > 0)
    // console.log(
    //  'Write:',this.buf,this.buf.toString().replace(/\n/g,'\\n'),
    //  ', nbWritten1=',nbWritten1,'nbWritten2=',nbWritten2,
    //  'writePos=',this.writePos,'lastIsWrite=',this.lastIsWrite)
    return nbWritten1 + nbWritten2
  }
  read () {
    // console.log('\nread()')
    let string = ['', '', '']
    const remain = this.length - this.capacity
    if (remain > 0) {
      let last = this.buf.indexOf('\n', this.readPos) + 1
      if (last === 0) {
        if (this.readPos + remain < this.length) {
          last = this.readPos + remain
        } else {
          string[1] = this.buf.toString(this.enc, this.readPos, this.length)
          // console.log('Prefix:',string[1])
          this.readPos = 0
          last = this.buf.indexOf('\n', 0) + 1
          if (last === 0) {
            last = remain - string[1].length
          }
        }
      }
      // console.log('string[1].length + last - this.readPos > remain:',string[1].length,last,this.readPos,remain)
      if (string[1].length + last - this.readPos > remain) {
        last = remain - string[1].length
      }
      // console.log('readPos,last:',this.readPos,last)
      string[2] = this.buf.toString(this.enc, this.readPos, last)
      string[0] = string[1].concat(string[2])
      this.readPos += string[2].length
      this.lastIsWrite = false
      // console.log('Read:','last=',last,'string.length=',string[0].length,'readPos=',this.readPos)
    }
    return string[0]
  }
}

const buf = new Readline(12)

const writes = ['node\n', '.', 'js\n', 'c\'est\n', 'cool\n', '.', '123456789012', '12345678']

// write everything, and read only when buffer capacity is not enough
for (let write of writes) {
  while (buf.write(write) === 0) {
    let read = buf.read().replace(/\n/g, '\\n')
    console.log('Read:', read)
    if (read === '') { break }
  }
  console.log('Write:', write.replace(/\n/g, '\\n'))
}

// read everything else
let read = buf.read().replace(/\n/g, '\\n')
while (read !== '') {
  console.log('Read:', read)
  read = buf.read().replace(/\n/g, '\\n')
}
