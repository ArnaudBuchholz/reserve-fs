'use strict'

const assert = require('./assert')

describe('fs.writeFile', async () => {
  before(() => require('./setup'))
  after(() => window.fsw.unlinkAsync('tmp/file.txt')
    .then(() => window.fsw.rmdirAsync('tmp'))
  )

  let method

  before(() => {
    method = window.fsw.writeFileAsync.bind(window.fsw)
  })

  before(() => window.fsw.mkdirAsync('tmp'))

  it('allows file creation', () => method('tmp/file.txt', '123')
    .then(() => window.fsw.statAsync('tmp/file.txt'))
    .then(stat => {
      assert(() => stat.isFile())
      assert(() => stat.size === 3)
    })
    .then(() => window.fsw.readFileAsync('tmp/file.txt'))
    .then(content => assert(() => content === '123'))
  )

  it('allows flags for file appending', () => method('tmp/file.txt', '456', { flag: 'a' })
    .then(() => window.fsw.statAsync('tmp/file.txt'))
    .then(stat => {
      assert(() => stat.isFile())
      assert(() => stat.size === 6)
    })
    .then(() => window.fsw.readFileAsync('tmp/file.txt'))
    .then(content => assert(() => content === '123456'))
  )

  it('forward errors (write on a folder)', () => method('folder', 'abc')
    .then(assert.notExpected, reason => {
      // console.log(reason.toString())
      assert(() => reason instanceof Error)
    })
  )

  it('forbids unauthorized access', () => method('../mocha/assert.js')
    .then(assert.notExpected, reason => {
      // console.log(reason.toString())
      assert(() => reason instanceof Error)
    })
  )
})
