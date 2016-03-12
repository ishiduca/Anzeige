var inherits   = require('inherits')
var hyperquest = require('hyperquest')
var qs         = require('querystring')
var Action     = require('flux-koime/action')

inherits(ActionTwitterPost, Action)
module.exports = ActionTwitterPost

function ActionTwitterPost (uri) {
    Action.call(this, 'twitter/post', 'notif')
    this.uri = uri
}

ActionTwitterPost.prototype.post = function (params) {
    var me  = this
    var buf = []
    var q   = qs.stringify(params)
    var req = hyperquest.post(this.uri, {headers: {
        'content-type': 'application/x-www-form-urlencoded'
      , 'content-length': Buffer.byteLength(q)
    }})

    req.once('error', function (err) { console.error(err) })
    req.on('data', function (chnk) { buf.push(chnk) })
    req.once('end', function () {
        var str = Buffer.isBuffer(buf[0]) ? String(Buffer.concat(buf)) : buf.join('')
        try {
            var data = JSON.parse(str)
            me.push(data)
        } catch (err) {
            console.error(err)
        }
    })

    req.end(q)
}
