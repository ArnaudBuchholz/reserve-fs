'use strict'

const assert = require('./assert')

describe('client', async () => {
  before(() => require('./setup'))

  it('builds window members', () => {
    assert(() => typeof window.fs === 'object')
    assert(() => typeof window.fsw === 'object')
  })

  it('distinguish window members', () => {
    assert(() => window.fs !== window.fsw)
  })

  it('exposes read-only members', () => {
    assert(() => typeof window.fs.readdir === 'function')
    assert(() => typeof window.fs.readFile === 'function')
    assert(() => typeof window.fs.stat === 'function')
    assert(() => !window.fs.mkdir)
    assert(() => !window.fs.rmdir)
    assert(() => !window.fs.writeFile)
  })

  it('exposes read/write members', () => {
    assert(() => typeof window.fsw.readdir === 'function')
    assert(() => typeof window.fsw.readFile === 'function')
    assert(() => typeof window.fsw.stat === 'function')
    assert(() => typeof window.fsw.mkdir === 'function')
    assert(() => typeof window.fsw.rmdir === 'function')
    assert(() => typeof window.fsw.writeFile === 'function')
  })

  it('exposes asynchronous version of members', () => {
    assert(() => typeof window.fs.readdirAsync === 'function')
    assert(() => typeof window.fs.readFileAsync === 'function')
    assert(() => typeof window.fs.statAsync === 'function')
    assert(() => typeof window.fsw.mkdirAsync === 'function')
    assert(() => typeof window.fsw.rmdirAsync === 'function')
    assert(() => typeof window.fsw.writeFileAsync === 'function')
  })
})
