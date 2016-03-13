var Store    = require('flux-koime/store')
var inherits = require('inherits')

inherits(StoreWebsocketMessage, Store)
module.exports = StoreWebsocketMessage

var maxLength = 400

function StoreWebsocketMessage (label, worker, mapper) {
    if (!(this instanceof StoreWebsocketMessage))
        return new StoreWebsocketMessage(label, worker, mapper)

    Store.call(this, label)

    this.list   = []
    this.label  = label
    this.worker = worker
    this.mapper = mapper

    var me = this

    worker.addEventListener('message', function (ev) {
        me.list = ev.data.slice(0, maxLength)
        mapper.postMessage([me.list, me.label])
    })

    mapper.addEventListener('message', function (ev) {
        me.push(ev.data)
    })
}

StoreWebsocketMessage.prototype.getList = function (list, done) {
    done()
    this.worker.postMessage([list, this.list])
}

StoreWebsocketMessage.prototype.pushList = function () {
    this.mapper.postMessage([this.list, this.label])
}
