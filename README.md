# REserve/**fs**
File system mapper for [REserve](https://npmjs.com/package/reserve).
It makes Node.js' [fs](https://nodejs.org/api/fs.html) APIs available in the browser.

[![Travis-CI](https://travis-ci.org/ArnaudBuchholz/reserve-fs.svg?branch=master)](https://travis-ci.org/ArnaudBuchholz/reserve-fs#)
[![Coverage Status](https://coveralls.io/repos/github/ArnaudBuchholz/reserve-fs/badge.svg?branch=master)](https://coveralls.io/github/ArnaudBuchholz/reserve-fs?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/b4fd0d69be50884018d7/maintainability)](https://codeclimate.com/github/ArnaudBuchholz/reserve-fs/maintainability)
[![Package Quality](https://npm.packagequality.com/shield/reserve-fs.svg)](https://packagequality.com/#?package=reserve-fs)
[![Known Vulnerabilities](https://snyk.io/test/github/ArnaudBuchholz/reserve-fs/badge.svg?targetFile=package.json)](https://snyk.io/test/github/ArnaudBuchholz/reserve-fs?targetFile=package.json)
[![dependencies Status](https://david-dm.org/ArnaudBuchholz/reserve-fs/status.svg)](https://david-dm.org/ArnaudBuchholz/reserve-fs)
[![devDependencies Status](https://david-dm.org/ArnaudBuchholz/reserve-fs/dev-status.svg)](https://david-dm.org/ArnaudBuchholz/reserve-fs?type=dev)
[![reserve](https://badge.fury.io/js/reserve-fs.svg)](https://www.npmjs.org/package/reserve-fs)
[![reserve](http://img.shields.io/npm/dm/reserve-fs.svg)](https://www.npmjs.org/package/reserve-fs)
[![install size](https://packagephobia.now.sh/badge?p=reserve-fs)](https://packagephobia.now.sh/result?p=reserve-fs)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FArnaudBuchholz%2Freserve-fs.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FArnaudBuchholz%2Freserve-fs?ref=badge_shield)


## Usage

* In the mapping :
```json
{
  "handlers": {
    "fs": "reserve/fs"
  },
  "mappings": [{
    "match": "\\/fs",
    "fs": "./"
  }]
}
```

* In the HTML page :
```html
<script src='/fs'></script>
```

* In JavaScript :
```javascript
fs.readdirAsync('folder')
  .then(names => names.forEach(async name => {
    const stat = await fs.statAsync('folder/' + name)
    console.log(name, stat.size, stat.ctime, stat.mtime)
  }))
```

## Options

| Option | Default Value | Explanation |
|---|---|---|
| `client-name` | `'fs'` | Name of the member added to the browser window |
| `read-only` | `false` | Forbids write methods if `true` |

All APIs are **restricted** to the scope of the path configured in the mapping. Any attempt to read or write elsewhere will lead to a `403` error.

## Supported APIs

The following APIs are supported. A promisified version of each method is provided under the same name suffixed with `Async` (for instance: `fs.readdirAsync`).

* read-only
  * [`fs.readdir`](https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback)
  * [`fs.readFile`](https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback): the returned data is converted to text
  * [`fs.stat`](https://nodejs.org/api/fs.html#fs_fs_fstat_fd_options_callback)
* read/write
  * [`fs.mkdir`](https://nodejs.org/api/fs.html#fs_fs_mkdir_path_options_callback)
  * [`fs.rmdir`](https://nodejs.org/api/fs.html#fs_fs_rmdir_path_options_callback)
  * [`fs.unlink`](https://nodejs.org/api/fs.html#fs_fs_unlink_path_callback)
  * [`fs.writeFile`](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback): `file` must be a file name, `data` is a string
