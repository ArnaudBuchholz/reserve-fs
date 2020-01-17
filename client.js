module.exports = function () {
  'use strict'

  var APIs = ''
  var NAME = ''
  var URL = ''

  var fs = {}

  function buildWrapper (members) {
    var Wrapper = function (values) {
      Object.keys(values)
        .filter(function (property) {
          return property !== '$class'
        })
        .forEach(function (property) {
          this[property] = values[property]
        }, this)
    }
    members.forEach(function (name) {
      Wrapper.prototype[name] = function () {
        return this['_' + name]
      }
    })
    return Wrapper
  }

  var direntMethods = 'isBlockDevice,isCharacterDevice,isDirectory,isFIFO,isFile,isSocket,isSymbolicLink'.split(',')
  var statDatePrefixes = 'a,m,c,birth'.split(',')

  var unwrappers = {}
  unwrappers.Dirent = buildWrapper(direntMethods)
  unwrappers.Stat = function () {
    unwrappers.Dirent.apply(this, arguments)
    statDatePrefixes.forEach(function (prefix) {
      this[prefix + 'time'] = new Date(this[prefix + 'timeMs'])
    }, this)
  }
  unwrappers.Stat.prototype = Object.create(unwrappers.Dirent.prototype)

  function unwrap (result) {
    if (result.$class) {
      return new unwrappers[result.$class](result)
    }
    return result
  }

  function parseResponse (responseText) {
    try {
      var response = JSON.parse(responseText)
      if (response.err) {
        return response
      }
      if (Array.isArray(response.result)) {
        response.result = response.result.map(unwrap)
      } else {
        response.result = unwrap(response.result)
      }
      return response
    } catch (e) {
      return {
        err: e
      }
    }
  }

  function api (name) {
    return function () {
      var parameters = [].slice.call(arguments)
      var callback = parameters.pop()
      var xhr = new XMLHttpRequest()
      xhr.open('POST', URL)
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var response = parseResponse(xhr.responseText)
            if (response.err) {
              callback(new Error(response.err))
            } else {
              callback(null, response.result)
            }
          } else {
            callback(new Error(xhr.statusText))
          }
        }
      }
      xhr.send(JSON.stringify({
        api: name,
        args: parameters
      }))
    }
  }

  function promisify (method) {
    return function () {
      var parameters = [].slice.call(arguments)
      var resolve
      var reject
      var promise = new Promise(function () {
        resolve = arguments[0]
        reject = arguments[1]
      })
      parameters.push(function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
      method.apply(null, parameters)
      return promise
    }
  }

  APIs.split(',').forEach(function (name) {
    var method = api(name)
    fs[name] = method
    fs[name + 'Async'] = promisify(method)
  })

  window[NAME] = fs
}
