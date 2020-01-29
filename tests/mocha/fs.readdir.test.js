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
      .then(assert.notExpected, reason => {
        // console.log(reason.toString())
        assert(() => reason instanceof Error)
      })
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

describe('fs.readdir', () => {
  before(() => require('./setup'))

  describe('read-only', test('fs'))
  describe('read/write', test('fsw'))

  describe('options', () => {
    it('withFileTypes', () => window.fs.readdirAsync('.', { withFileTypes: true })
      .then(entries => {
        var helloWorldEntry = entries.filter(entry => entry.name === 'hello world.txt')[0]
        assert(() => !!helloWorldEntry)
        assert(() => !helloWorldEntry.isBlockDevice())
        assert(() => !helloWorldEntry.isCharacterDevice())
        assert(() => !helloWorldEntry.isDirectory())
        assert(() => !helloWorldEntry.isFIFO())
        assert(() => helloWorldEntry.isFile())
        assert(() => !helloWorldEntry.isSocket())
        assert(() => !helloWorldEntry.isSymbolicLink())

        var folderEntry = entries.filter(entry => entry.name === 'folder')[0]
        assert(() => folderEntry.isDirectory())
        assert(() => !folderEntry.isFile())
      })
    )
  })
})
