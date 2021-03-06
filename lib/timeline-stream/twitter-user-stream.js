var stream   = require('readable-stream')
var inherits = require('inherits')
var xtend    = require('xtend')
var safe     = require('json-stringify-safe')
var debug    = require('debug')('twitter@user/stream')

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

    stream.Readable.call(this)

    var opt = xtend(defaultOpt, _opt)
    this.client   = client
    this.service  = service
    this.timeline = timeline

    Object.keys(opt).forEach(function (key) {
        this[key] = opt[key]
    }.bind(this))

    this.setMaxListeners(0)
}

TwitterUserStream.prototype.destroy = function () {
    this.twStream && this.twStream.destroy()
    this.twStream = null
    this.emit('destroy')
}

TwitterUserStream.prototype._read = function () {
//console.log('[%s _read]', this.constructor.name)
    if (this.twStream) return
    if (! this._readableState.pipes) {
        this.destroy()
        return this.push('')
    }

    var me = this
    this.client.stream(this.method, this.params, function (twStream) {
        me.twStream = twStream

        twStream.on('error', function (err) { me.emit('error', err) })
        twStream.on('data', function (tweet) {
tweet.user && debug('@%s >> %s', tweet.user.screen_name, tweet.text)
            me.push(safe({
                service: me.service
              , timeline: me.timeline
              , data: [tweet]
            }))
        })
        twStream.once('end', function (response) {
            me.emit('twitter.stram.ended', response)
            me.destroy()
            me.push('')
        })
    })
}

TwitterUserStream.prototype.get = function () {
    this.push('')
}
