'use strict'

const assert = require('./assert')

describe('readdir', async () => {
  before(() => require('./setup'))

  it('enables directory listing', () => window.fs.readdirAsync('.')
    .then(names => {
      assert(() => names.includes('hello world.txt'))
    })
  )
})
