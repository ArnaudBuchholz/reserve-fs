'use strict'

const assert = require('./assert')

function test (member) {
  return () => {
    let method

    before(() => {
      method = window[member].readdirAsync.bind(window[member])
    })

    it('enables directory listing', () => method('.')
      .then(names => {
        assert(() => names.includes('hello world.txt'))
        assert(() => names.includes('folder'))
      })
    )

    it('enables sub directory listing', () => method('folder')
      .then(names => {
        assert(() => names.includes('lorem ipsum.txt'))
      })
    )

    it('forward errors (not a folder)', () => method('hello world.txt')
      .then(names => assert(() => !'not expected'), reason => {
        console.log(reason.toString())
        assert(() => reason instanceof Error)
      })
    )

    it('forward errors (does not exist)', () => method('unknown')
      .then(names => assert(() => !'not expected'), reason => {
        console.log(reason.toString())
        assert(() => reason instanceof Error)
      })
    )

    it('forbids unauthorized access', () => method('../mocha')
      .then(names => assert(() => !'not expected'), reason => {
        console.log(reason.toString())
        assert(() => reason instanceof Error)
      })
    )
  }
}

describe('readdir', async () => {
  before(() => require('./setup'))

  describe('read-only', test('fs'))
  describe('read/write', test('fsw'))
})
