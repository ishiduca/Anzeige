var stream   = require('readable-stream')
var inherits = require('inherits')
var xtend    = require('xtend')
var safe     = require('json-stringify-safe')
var empty    = require('is-empty')

var defaultOpt = {
    interval: 1000 * 60 * 5
  , maxIndexLength: 400
}

inherits(Crawler, stream.Readable)
module.exports = Crawler

function Crawler (client, service, timeline, _opt) {
    if (!(this instanceof Crawler))
        return new Crawler(client, service, timeline, _opt)

    stream.Readable.call(this)

    var opt = xtend(defaultOpt, _opt)
    this.client   = client
    this.service  = service
    this.timeline = timeline
    this.index    = []

    Object.keys(opt).forEach(function (key) {
        this[key] = opt[key]
    }.bind(this))

    this.setMaxListeners(0)
}

//Crawler.prototype.unpipe = function () {
//    stream.Readable.prototype.unpipe.apply(this, arguments)
//    if (this._readableState.pipesCount === 0 && this.intervalID) this.destroy()
//}

Crawler.prototype.destroy = function () {
    clearInterval(this.intervalID)
    this.intervalID = null
    this.emit('destroy')
}

Crawler.prototype._read = function () {
    if (this.intervalID) return
    if (! this._readableState.pipes) {
        this.destroy()
        return this.push('')
    }

    this.intervalID = setInterval(function () {
        if (this._readableState.pipes) this.get()
        else this.destroy()
    }.bind(this), this.interval)
}

Crawler.prototype.get = function () {
    var me = this
    this._get(function (err, filtered_data) {
        if (err) return me.emit('error', err)
        if (empty(filtered_data)) return me.push('')

        me.push(safe({
            service:  me.service
          , timeline: me.timeline
          , data:     filtered_data
        }))

        me.index = me.index.slice(0, me.maxIndexLength)
    })
}

Crawler.prototype._get = function () {
    throw new Error('not implement "._get" method')
}
