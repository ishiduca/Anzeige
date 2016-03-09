var safe  = require('json-stringify-safe')
var xtend = require('xtend')

var _CONTENT_TYPES = {
    text: 'text/plain'
  , json: 'applicaion/json'
  , html: 'text/html'
}

var CONTENT_TYPES = Object.keys(_CONTENT_TYPES).reduce(function (hash, key) {
    hash[key] = _CONTENT_TYPES[key] + '; charset=utf-8'
    return hash
}, {})

module.exports = Helper

function Helper (req, res) {
    if (!(this instanceof Helper)) return new Helper(req, res)

    this.req = req
    this.res = res
}

Helper.prototype.response = function (body, opt) {
    opt || (opt = {})
    opt.headers || (opt.headers = {})

    this.res.statusCode = opt.statusCode || 200

    var res = this.res

    Object.keys(opt.headers).forEach(function (key) {
        res.setHeader(key, opt.headers[key])
    })

    res.getHeader('content-type')   || res.setHeader('content-type', CONTENT_TYPES.text)
    res.getHeader('content-length') || res.setHeader('content-length', Buffer.byteLength(body))

    res.end(body)
}

Helper.prototype.error = function (err, opt) {
    this.response(Error.prototype.toString(err)
        , xtend({statusCode: err.statusCode || 500}, opt))
}

Helper.prototype.json = function (data, opt) {
    this.response(safe(data)
      , xtend(opt, {headers: {'content-type': CONTENT_TYPES.json}}))
}
