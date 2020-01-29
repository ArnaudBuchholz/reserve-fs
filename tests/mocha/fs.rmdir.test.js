'use strict'

const assert = require('./assert')

describe('fs.rmdir', () => {
  before(() => require('./setup'))
  after(() => window.fsw.rmdirAsync('tmp'))

  let method

  before(() => {
    method = window.fsw.rmdirAsync.bind(window.fsw)
  })

  before(() => window.fsw.mkdirAsync('tmp/a', { recursive: true }))

  it('allows folder deletion', () => window.fsw.statAsync('tmp/a')
    .then(stat => assert(() => stat.isDirectory()))
    .then(() => method('tmp/a'))
    .then(() => window.fsw.statAsync('tmp/a'))
    .then(assert.notExpected, reason => {
      assert(() => reason instanceof Error)
    })
    .then(() => window.fsw.statAsync('tmp'))
    .then(stat => assert(() => stat.isDirectory()))
  )

  it('forward errors (folder does not exists)', () => method('tmp/b')
    .then(assert.notExpected, reason => {
      // console.log(reason.toString())
      assert(() => reason instanceof Error)
    })
  )

  it('forbids unauthorized access', () => method('../mocha')
    .then(assert.notExpected, reason => {
      // console.log(reason.toString())
      assert(() => reason instanceof Error)
    })
  )
})
