'use strict'

const assert = require('./assert')

describe('fs.unlink', () => {
  before(() => require('./setup'))
  after(() => window.fsw.rmdirAsync('tmp'))

  let method

  before(() => {
    method = window.fsw.unlinkAsync.bind(window.fsw)
  })

  before(() => window.fsw.mkdirAsync('tmp'))
  before(() => window.fsw.writeFileAsync('tmp/tmp.txt', 'Hello World!'))

  it('allows file deletion', () => window.fsw.statAsync('tmp/tmp.txt')
    .then(stat => assert(() => stat.isFile()))
    .then(() => method('tmp/tmp.txt'))
    .then(() => window.fsw.statAsync('tmp/tmp.txt'))
    .then(assert.notExpected, reason => {
      assert(() => reason instanceof Error)
    })
  )

  it('forward errors (file does not exists)', () => method('unknown')
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
