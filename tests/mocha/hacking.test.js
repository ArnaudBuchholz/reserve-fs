'use strict'

const assert = require('./assert')

describe('hacking', async () => {
  let mocked

  before(async () => {
    mocked = await require('./setup')
  })

  it('prevents unauthorized api use (mkdir on read-only)', () => mocked.request('POST', '/fs-ro', {}, JSON.stringify({
    api: 'mkdir',
    args: 'test'
  }))
    .then(response => {
      assert(() => response.statusCode === 404)
    })
  )

  it('handles unexpected errors', () => window.fs.readdirAsync('json-parsing-fail')
    .then(assert.notExpected, reason => {
      assert(() => reason instanceof Error)
    })
  )

  'HEAD,PUT,DELETE,CUSTOM'.split(',').forEach(verb => {
    it(`prevents unauthorized verb use (${verb})`, () => mocked.request(verb, '/fs-ro', {}, JSON.stringify({
      api: 'readdir',
      args: '.'
    }))
      .then(response => {
        assert(() => response.statusCode === 500)
      })
    )
  })
})
