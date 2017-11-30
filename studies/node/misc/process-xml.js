const fs = require('fs')
const { Parser, Builder } = require('xml2js')

const xmlFile = process.argv[2] || console.error('Error: Missing parameter xmlFile')

async function xml2js (xml) {
  return new Promise((resolve, reject) => {
    const parser = new Parser()
    parser.parseString(xml, (err, data) => {
      if (err) reject(new Error(err))
      resolve(data)
    })
  })
}

function js2xml (object) {
  const builder = new Builder()
  return builder.buildObject(object)
}

async function main () {
  const xml = fs.readFileSync(xmlFile).toString()
  // console.log(xml)

  const object = await xml2js(xml)
  // console.log(JSON.stringify(object, null, 2))

  const xmlbis = js2xml(object)
  console.log(xmlbis)

  // const objbis = await xml2js(xmlbis)
  // console.log(JSON.stringify(objbis, null, 2))
}

trycatch(main)

function trycatch (cb) {
  // console.log('launching async processes')
  _trycatch(cb)
  // console.log('async processes launched')
}

async function _trycatch (cb) {
  try {
    await cb()
    // console.log('async processes succeeded, nothing more to do, leaving script')
  } catch (err) {
    console.error('async processes failed with error:', err.message)
  }
}
