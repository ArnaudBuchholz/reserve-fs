# reserve-fs
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FArnaudBuchholz%2Freserve-fs.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FArnaudBuchholz%2Freserve-fs?ref=badge_shield)

File system mapper for [REserve](https://npmjs.com/package/reserve).
It makes Node.js' [fs](https://nodejs.org/api/fs.html) APIs available in the browser.

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


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FArnaudBuchholz%2Freserve-fs.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FArnaudBuchholz%2Freserve-fs?ref=badge_large)