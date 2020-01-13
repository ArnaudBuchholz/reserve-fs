# reserve-fs
fs handler for [reserve](https://npmjs.com/package/reserve)

It provides a client/server API that wraps most Node.js' [fs](https://nodejs.org/api/fs.html) API

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

* client-name: 'fs'
* read-only: false

## Supported APIs
