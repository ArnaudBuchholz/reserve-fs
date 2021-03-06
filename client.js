module.exports = function () {
  'use strict'

  var APIs = '<APIS>'
  var NAME = '<NAME>'
  var URL = '<URL>'

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
    if (result && result.$class) {
      return new unwrappers[result.$class](result)
    }
    return result
  }

  function parseResponses (responseText) {
    return JSON.parse(responseText)
      .map(function (response) {
        if (response.err) {
          return response
        }
        if (Array.isArray(response.result)) {
          response.result = response.result.map(unwrap)
        } else {
          response.result = unwrap(response.result)
        }
        return response
      })
  }

  var pending = []

  function batch () {
    var xhr = new XMLHttpRequest()
    var processing = pending
    pending = []
    xhr.open('POST', URL)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        var error
        if (xhr.status === 200) {
          try {
            parseResponses(xhr.responseText)
              .forEach(function (response, index) {
                var callback = processing[index].callback
                if (response.err) {
                  callback(new Error(response.err))
                } else {
                  callback(null, response.result)
                }
              })
          } catch (e) {
            error = e
          }
        } else {
          error = new Error(xhr.statusText)
        }
        processing.forEach(function (item) {
          item.callback(error)
        })
      }
    }
    xhr.send(JSON.stringify(processing))
  }

  function api (name) {
    return function () {
      var parameters = [].slice.call(arguments)
      var callback = parameters.pop()
      pending.push({
        api: name,
        args: parameters,
        callback: callback
      })
      if (pending.length === 1) {
        setTimeout(batch, 0)
      }
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

// Enables coverage
/* istanbul ignore next */
const coverage = (/(cov_[a-z0-9]+)/.exec(module.exports.toString()) || {})[1]
/* istanbul ignore next */
if (coverage) {
  global[coverage] = eval(coverage) // eslint-disable-line no-eval
}
