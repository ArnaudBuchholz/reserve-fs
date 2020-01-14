'use strict'

const assert = require('./assert')

describe('client', async () => {
  before(() => require('./setup'))

  it('builds window members', () => {
    assert(() => typeof window.fs === 'object')
    assert(() => typeof window.fsw === 'object')
  })
})
