'use strict'

const assert = require('./assert')

describe('fs.mkdir', () => {
  before(() => require('./setup'))
  after(() => window.fsw.rmdirAsync('tmp/a/b/c')
    .then(() => window.fsw.rmdirAsync('tmp/a/b'))
    .then(() => window.fsw.rmdirAsync('tmp/a'))
    .then(() => window.fsw.rmdirAsync('tmp'))
  )

  let method

  before(() => {
    method = window.fsw.mkdirAsync.bind(window.fsw)
  })

  it('allows folder creation', () => method('tmp')
    .then(() => window.fsw.statAsync('tmp'))
    .then(stat => assert(() => stat.isDirectory()))
  )

  it('allows recursive folder creation', () => method('tmp/a/b/c', { recursive: true })
    .then(() => window.fsw.statAsync('tmp/a/b'))
    .then(stat => assert(() => stat.isDirectory()))
    .then(() => window.fsw.statAsync('tmp/a/b/c'))
    .then(stat => assert(() => stat.isDirectory()))
  )

  it('forward errors (folder already exists)', () => method('tmp/a/b')
    .then(assert.notExpected, reason => {
      // console.log(reason.toString())
      assert(() => reason instanceof Error)
    })
  )

  it('forbids unauthorized access', () => method('../mocha/tmp')
    .then(assert.notExpected, reason => {
      // console.log(reason.toString())
      assert(() => reason instanceof Error)
    })
  )
})
