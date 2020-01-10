'use strict'

const fs = require('fs')
const path = require('path')
const util = require('util')

module.export = {

  async redirect ({ mapping, match, redirect, request, response }) {
    const method = request.method

    if (!["GET", "PUT", "POST", "OPTIONS", "DELETE"].includes(method)) {
      return 500
    }
  }

}
