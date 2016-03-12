var Store    = require('flux-koime/store')
var inherits = require('inherits')

inherits(StoreTwitterPost, Store)
module.exports = StoreTwitterPost

function StoreTwitterPost () {
    Store.call(this, 'twitter/post')
}

StoreTwitterPost.prototype.notif = function (data, done) {
    done(null, data)
}
