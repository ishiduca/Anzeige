var inherits = require('inherits')
var Store    = require('flux-koime/store')

inherits(StorePrepareReply, Store)
module.exports = StorePrepareReply

function StorePrepareReply () {
    Store.call(this, 'prepareReply')
}

StorePrepareReply.prototype.prepare = function (data, done) {
    done(null, data)
}
