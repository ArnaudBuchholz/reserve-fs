'use strict'

const assert = require('./assert')

function test (member) {
  return () => {
    let method

    before(() => {
      method = window[member].readFileAsync.bind(window[member])
    })

    it('reads the content of a text file', () => method('hello world.txt')
      .then(content => assert(() => content === 'hello world\n'))
    )

    it('supports options while reading a text file', () => method('hello world.txt', { flag: 'r' })
      .then(content => assert(() => content === 'hello world\n'))
    )

    it('reads the content of a big text file', () => method('folder/lorem ipsum.txt')
      .then(content => assert(() => content.endsWith('Phasellus posuere.\n')))
    )

    it('forward errors (does not exist)', () => method('unknown')
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
  }
}

describe('fs.readFile', async () => {
  before(() => require('./setup'))

  describe('read-only', test('fs'))
  describe('read/write', test('fsw'))
})
