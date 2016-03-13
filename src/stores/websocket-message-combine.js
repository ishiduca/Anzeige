var stream   = require('readable-stream')
var inherits = require('inherits')

inherits(StoreWebsocketMessageCombine, stream.Transform)
module.exports = StoreWebsocketMessageCombine

var maxLength = 1200

function StoreWebsocketMessageCombine (worker) {
    if (!(this instanceof StoreWebsocketMessageCombine))
        return new StoreWebsocketMessageCombine(worker)

    stream.Transform.call(this, {objectMode: true})

    this.list   = []
    this.label  = 'all'
    this.worker = worker

    var me = this

    worker.addEventListener('message', function (ev) {
        me.list = ev.data.slice(0, maxLength)
        me.push(me.list)
    })
}

StoreWebsocketMessageCombine.prototype._transform = function (list, enc, done) {
    done()
    this.worker.postMessage([list, this.list])
}

StoreWebsocketMessageCombine.prototype.pushList = function () {
    this.push(this.list)
}
