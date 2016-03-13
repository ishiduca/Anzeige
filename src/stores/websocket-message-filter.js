var inherits = require('inherits')
var stream   = require('readable-stream')
var Store    = require('flux-koime/store')

inherits(StoreWebsocketMessageFilter, Store)
module.exports = StoreWebsocketMessageFilter

function StoreWebsocketMessageFilter (worker) {
    if (!(this instanceof StoreWebsocketMessageFilter))
        return new StoreWebsocketMessageFilter(worker)

    Store.call(this, 'timeline/filter')

    var filterStream = this.filterStream = new FilterStream(worker)
    var me = this

    filterStream.on('pipe', function (src) {
        this.source = src
    })
    filterStream.on('unpipe', function (src) {
        this.source = null
    })
    filterStream.on('error', function (err) {
        me.emit('error', err)
    })
}

StoreWebsocketMessageFilter.prototype.grep = function (str, done) {
    this.filterStream.filterStr = str
    this.filterStream.pushList()
    done()
}

inherits(FilterStream, stream.Transform)

function FilterStream (worker) {
    stream.Transform.call(this, {objectMode: true})

    this.worker = worker
    var me = this

    worker.addEventListener('message', function (ev) {
        me.push(ev.data)
    })
}

FilterStream.prototype._transform = function (list, enc, done) {
    if (! this.filterStr) return done(null, list)

    done()
    this.worker.postMessage({list: list, filterStr: this.filterStr})
}

FilterStream.prototype.pushList = function () {
    this.source && this.source.pushList()
}
