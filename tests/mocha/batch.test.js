'use strict'

const assert = require('./assert')

describe('batch', () => {
  before(() => require('./setup'))
  beforeEach(() => {
    XMLHttpRequest.count = 0
  })

  it('groups requests', () => Promise.all([
    window.fs.readFileAsync('hello world.txt'),
    window.fs.readFileAsync('folder/lorem ipsum.txt')
  ])
    .then(contents => {
      assert(() => contents[0] === 'hello world\n')
      assert(() => contents[1].endsWith('Phasellus posuere.\n'))
      assert(() => XMLHttpRequest.count === 1)
    })
  )
})
