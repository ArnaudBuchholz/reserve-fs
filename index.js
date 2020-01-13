'use strict'

const fs = require('fs')
const path = require('path')
const util = require('util')

const readdirAsync = util.promisify(fs.readdir)

const readApis = 'readdir,stat'.split(',')
const writeApis = ''.split(',')
const clientTemplatePromise = readdirAsync(path.join(__dirname, 'client.js')).then(buffer => buffer.toString())

function readBody (request) {
  return new Promise((resolve, reject) => {
    const buffer = []
    request
      .on('data', chunk => buffer.push(chunk.toString()))
      .on('error', reject)
      .on('end', () => resolve(buffer.join('')))
  })
}

function send (response, answer) {
  response.writeHead(200, {
    'Content-Type': 'application/javascript',
    'Content-Length': answer.length
  })
  response.end(answer)
}

module.export = {

  async redirect ({ mapping, match, redirect, request, response }) {
    const method = request.method
    const allApis = readApis
    if (!mapping['read-only']) {
     allApis = allApis.concat(writeApis)
    }

    if (method === 'GET') {
      const clientString = (await clientTemplatePromise)
        .replace(`APIs = ''`, `APIs = '${allApis.join(',')}'`)
        .replace(`NAME = ''`, `NAME = '${mapping['client-name'] || 'fs'}'`)
        .replace(`URL = ''`, `URL = '${request.url}'`)
      send(response, clientString)
      return
    }

    if (method === 'POST') {
      const body = await readBody(request)
      const call = JSON.parse(body)
      if (!allApis.includes(call.name)){
        return 404
      }
      fs[call.name].apply(fs, call.args.concat((err, result) => {
        send(response, JSON.stringify({ err, result }))
      }))
    }

    return 500
}
