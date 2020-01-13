'use strict'

const fs = require('fs')
const path = require('path')
const util = require('util')

const statAsync = util.promisify(fs.stat)
const unlinkAsync = util.promisify(fs.unlink)
const rmdirAsync = util.promisify(fs.rmdir)

const
  _read = (response, filePath) => {
      fs.readFile(filePath, (err, data) => _succeeded(response, err, data));
  },

  _readFolder = (response, folderPath) => {
      fs.readdir(folderPath, (err, files) => _succeeded(response, err, JSON.stringify(files)));
  },

  _write = ({request, response, file}) => {
      const
          filePath = file.path,
          data = [],
          flag = request.method === "POST" ? "w" : "a";
      request
          .on("data", chunk => {
              data.push(chunk);
          })
          .on("end", () => {
              fs.writeFile(filePath, Buffer.concat(data), {flag}, err => _succeeded(response, err));
          });
  },

  _handlers = {

      OPTIONS: ({ response }) => {
          response.end()
      },

      GET: ({ response, filePath, fileStat }) => {
          if (fileStat.isDirectory()) {
              return _readFolder({ response, filePath })
          }
          return _readFile({ response, filePath })
      },

      DELETE: ({ request, response, filePath, fileStat }) => {
        if (fileStat.isDirectory()) {
          return rmdirAsync(filePath).then(() => 204)
        }
        return unlinkAsync(filePath).then(() => 204)
      },

      POST: _write,

      PUT: _write

  }


module.export = {

  async redirect ({ mapping, match, redirect, request, response }) {
    const method = request.method

    if (!['GET', 'PUT', 'POST', 'OPTIONS', 'DELETE'].includes(method)) {
      return // Not handled
    }

    const filePath = /([^?#]+)/.exec(unescape(redirect))[1] // filter URL parameters & hash

    let fileStat
    try {
      fileStat = await statAsync(filePath)
    } catch (err) {
      if (mapping['read-only'] || method !== 'POST') {
        return 404
      }
    }

    if (fileStat && request.headers['x-get-fs-stat']) {
      request.setHeader('x-fs-stat', JSON.stringify({
        isDirectory: fileState.isDirectory(),
        size: fileStat.size,
        ctime: fileStat.ctime.toISOString(),
        mtime: fileStat.mtime.toISOString(),
      }))
    }

    return _handlers[method]({ filePath, fileStat, request, response })
      .catch(() => 500)
  }

}
