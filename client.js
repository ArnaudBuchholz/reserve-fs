(function () {
  'use strict'

  var APIs = ''
  var NAME = ''
  var URL = ''

  var fs = {}

  function api (name) {
    return function () {
      var parameters = [].slice.call(arguments)
      var callback = parameters.pop()
      var xhr = new XMLHttpRequest()
      xhr.open('POST', URL)
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200)) {
            var response = JSON.parse(responseText)
            if (response.err) {
              callback(new Error(response.err))
            } else {
              callback(0, response.result)
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

}())
