var stream   = require('readable-stream')
var inherits = require('inherits')
var xtend    = require('xtend')
var safe     = require('json-stringify-safe')

var defaultOpt = {
    maxIndexLength: 400
  , method: 'user'
  , params: {}
}

inherits(TwitterUserStream, stream.Readable)
module.exports = TwitterUserStream

function TwitterUserStream (client, service, timeline, _opt) {
    if (!(this instanceof TwitterUserStream))
        return new TwitterUserStream(client, service, timeline, _opt)

    stream.Readable.call(this, {objectMode: true})

    var opt = xtend(defaultOpt, _opt)
    this.client   = client
    this.service  = service
    this.timeline = timeline

    Object.keys(opt).forEach(function (key) {
        this[key] = opt[key]
    }.bind(this))

    this.setMaxListeners(0)
}

//TwitterUserStream.prototype.unpipe = function () {
//    stream.Readable.prototype.unpipe.apply(this, arguments)
//    if (this._readableState.pipesCount === 0 && this.twStream) this.destroy()
//}

TwitterUserStream.prototype.destroy = function () {
    this.twStream && this.twStream.destroy()
    this.twStream = null
}

TwitterUserStream.prototype._read = function () {
    if (this._readableState.pipesCount > 0 && ! this.twStream) this.get()
}

TwitterUserStream.prototype.get = function () {
    if (this.twStream) return

    var me = this
    this.client.stream(this.method, this.params, function (twStream) {
        me.twStream = twStream

        twStream.on('error', function (err) { me.emit('error', err) })
        twStream.on('data', function (tweet) {
            me.push(safe({
                service: me.service
              , timeline: me.timeline
              , data: [tweet]
            }))
        })
        twStream.once('end', function (response) {
            me.emit('twitter.stream.ended', response)
        })
    })
}
