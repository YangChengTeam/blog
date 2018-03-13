const zlib = require("zlib")

var fs = require('fs')
var data = fs.readFileSync('test.chls')
console.log(zlib.gunzipSync(data).toString())


