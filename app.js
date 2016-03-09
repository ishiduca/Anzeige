'use strict'
var http     = require('http')
var path     = require('path')
var url      = require('url')
var xtend    = require('xtend')
var body     = require('body/any')
var ecstatic = require('ecstatic')(path.join(__dirname, 'public'))
var Router   = require('router-line').Router
var helper   = require('helper')
var router   = new Router

router.POST('/api/twitter/post', post(require('api/twitter/post')))

var server = module.exports = http.createServer(function (req, res) {
    var method = req.method.toUpperCase()
    var opt    = url.parse(req.url, !0)
    var result = router.route(method, opt.pathname)

    if (result)
        result.value(helper(req, res), xtend(opt.query, result.params))
    else
        ecstatic(req, res)
})

if (!module.parent) {
    var port = process.env.PORT || 3001
    server.listen(port, function () {
        console.log('[process.pid - %s]', process.pid)
        console.log('[server start to listen on port %s]', server.address().port)
    })
}

function post (f) {
    return function (help, params) {
        body(help.req, help.res, function (err, data) {
            if (err) help.error(err)
            else f(help, xtend(params, data))
        })
    }
}
