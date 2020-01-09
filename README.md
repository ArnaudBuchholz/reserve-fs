# reserve-fs
fs handler for [reserve](https://npmjs.com/package/reserve)

## Usage

```json
{
  "handlers": {
    "fs": "reserve/fs"
  },
  "mappings": [{
    "match": "\\/(.*)",
    "fs": "./$1"
  }]
}
```  

## Options

* read-only

## Supported verbs

HEAD
  file info is transmitted in th header

GET
  on a folder lists the content
  on a file, read as string
  
DELETE
  delete a file
  delete a folder if empty
  
POST
  create a file
  
PUT
  append to a file
