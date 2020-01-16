'use strict'

const fs = require('fs')
const path = require('path')
const util = require('util')

const readApis = 'readdir,readFile,stat'.split(',')
const writeApis = 'mkdir,rmdir,writeFile'.split(',')

const fsAsync = {}
readApis.concat(writeApis).forEach(api => {
    fsAsync[api] = util.promisify(fs[api])
})

const clientTemplatePromise = fsAsync.readFile(path.join(__dirname, 'client.js')).then(buffer => buffer.toString())

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

module.exports = {
  async redirect ({ mapping, match, redirect, request, response }) {
    const method = request.method
    let allApis = readApis
    if (!mapping['read-only']) {
      allApis = allApis.concat(writeApis)
    }

    if (method === 'GET') {
      const clientString = (await clientTemplatePromise)
        .replace('APIs = \'\'', `APIs = '${allApis.join(',')}'`)
        .replace('NAME = \'\'', `NAME = '${mapping['client-name'] || 'fs'}'`)
        .replace('URL = \'\'', `URL = '${request.url}'`)
      send(response, clientString)
      return
    }

    if (method === 'POST') {
      const body = await readBody(request)
      const call = JSON.parse(body)
      const api = call.api
      if (!allApis.includes(api)) {
        return 404
      }
      call.args[0] = path.join(redirect, call.args[0])
      if (!call.args[0].startsWith(redirect)) { // Use of .. to climb up the hierarchy
        return 403
      }
      return fsAsync[api].apply(fs, call.args)
        .then(result => JSON.stringify({ result }))
        .catch(err => JSON.stringify({ err: err.message }))
        .then(answer => send(response, answer))
    }

    return 500
  }
}
