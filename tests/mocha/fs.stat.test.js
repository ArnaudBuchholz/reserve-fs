'use strict'

const path = require('path')
const assert = require('./assert')

function test (member) {
  return () => {
    let method

    before(() => {
      method = window[member].statAsync.bind(window[member])
    })

    it('gets file info', () => method('hello world.txt')
      .then(fileStat => {
        assert(() => !!fileStat)
        assert(() => !fileStat.isBlockDevice())
        assert(() => !fileStat.isCharacterDevice())
        assert(() => !fileStat.isDirectory())
        assert(() => !fileStat.isFIFO())
        assert(() => fileStat.isFile())
        assert(() => !fileStat.isSocket())
        assert(() => !fileStat.isSymbolicLink())
        assert(() => typeof fileStat.dev === 'number')
        assert(() => typeof fileStat.ino === 'number')
        assert(() => typeof fileStat.mode === 'number')
        assert(() => typeof fileStat.nlink === 'number')
        assert(() => typeof fileStat.uid === 'number')
        assert(() => typeof fileStat.gid === 'number')
        assert(() => typeof fileStat.rdev === 'number')
        assert(() => fileStat.size === 12)
        if (path.join === path.posix.join) {
          assert(() => typeof fileStat.blksize === 'number')
          assert(() => typeof fileStat.blocks === 'number')
        }
        assert(() => typeof fileStat.atimeMs === 'number')
        assert(() => typeof fileStat.mtimeMs === 'number')
        assert(() => typeof fileStat.ctimeMs === 'number')
        assert(() => typeof fileStat.birthtimeMs === 'number')
        assert(() => fileStat.atime instanceof Date)
        assert(() => fileStat.mtime instanceof Date)
        assert(() => fileStat.ctime instanceof Date)
        assert(() => fileStat.birthtime instanceof Date)
      })
    )

    it('gets directory info', () => method('folder')
      .then(folderStat => {
        assert(() => !!folderStat)
        assert(() => !folderStat.isBlockDevice())
        assert(() => !folderStat.isCharacterDevice())
        assert(() => folderStat.isDirectory())
        assert(() => !folderStat.isFIFO())
        assert(() => !folderStat.isFile())
        assert(() => !folderStat.isSocket())
        assert(() => !folderStat.isSymbolicLink())
        assert(() => typeof folderStat.dev === 'number')
        assert(() => typeof folderStat.ino === 'number')
        assert(() => typeof folderStat.mode === 'number')
        assert(() => typeof folderStat.nlink === 'number')
        assert(() => typeof folderStat.uid === 'number')
        assert(() => typeof folderStat.gid === 'number')
        assert(() => typeof folderStat.rdev === 'number')
        assert(() => typeof folderStat.size === 'number')
        if (path.join === path.posix.join) {
          assert(() => typeof folderStat.blksize === 'number')
          assert(() => typeof folderStat.blocks === 'number')
        }
        assert(() => typeof folderStat.atimeMs === 'number')
        assert(() => typeof folderStat.mtimeMs === 'number')
        assert(() => typeof folderStat.ctimeMs === 'number')
        assert(() => typeof folderStat.birthtimeMs === 'number')
        assert(() => folderStat.atime instanceof Date)
        assert(() => folderStat.mtime instanceof Date)
        assert(() => folderStat.ctime instanceof Date)
        assert(() => folderStat.birthtime instanceof Date)
      })
    )

    it('gets sub file info', () => method('folder/lorem ipsum.txt')
      .then(fileStat => {
        assert(() => !!fileStat)
        assert(() => !fileStat.isDirectory())
        assert(() => fileStat.isFile())
        assert(() => fileStat.size === 65749)
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

describe('fs.stat', async () => {
  before(() => require('./setup'))

  describe('read-only', test('fs'))
  describe('read/write', test('fsw'))
})
