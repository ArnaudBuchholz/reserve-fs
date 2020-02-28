'use strict'

const path = require('path')

let request

global.window = {}

const statuses = {
  403: 'Forbidden',
  404: 'Not found',
  405: 'Method Not Allowed',
  500: 'Internal Server Error'
}

class XMLHttpRequest {
  open (method, url) {
    this._method = method
    this._url = url
    this.readyState = 1
    this.onreadystatechange()
  }

  send (body) {
    ++XMLHttpRequest.count
    request(this._method, this._url, {}, body)
      .then(response => {
        this.readyState = 2
        this.onreadystatechange()
        this.readyState = 3
        this.onreadystatechange()
        this.readyState = 4
        this.status = response.statusCode
        if (JSON.parse(body)[0].args[0] === 'json-parsing-fail') {
          this.responseText = '!' // Will fail JSON parsing
        } else {
          this.responseText = response.toString()
        }
        this.onreadystatechange()
      })
  }

  get statusText () {
    return statuses[this.status]
  }

  onreadystatechange () {}
}

XMLHttpRequest.count = 0

const Func = Function

global.XMLHttpRequest = XMLHttpRequest

module.exports = require('reserve/mock')({
  port: 8000,
  handlers: {
    fs: require('../../index.js')
  },
  mappings: [{
    match: /\/fs-ro/,
    'read-only': true,
    fs: path.join(__dirname, '../data')
  }, {
    match: /\/fs-rw/,
    'client-name': 'fsw',
    fs: path.join(__dirname, '../data/writable')
  }]
})
  .then(mocked => {
    request = mocked.request.bind(mocked)
    return request('GET', '/fs-ro')
      .then(response => {
        new Func(response.toString())()
        return request('GET', '/fs-rw')
      })
      .then(response => {
        new Func(response.toString())()
        return mocked
      })
  })
