var inherits = require('inherits')
var Store    = require('flux-koime/store')

inherits(StoreModal, Store)
module.exports = StoreModal

function StoreModal () {
    Store.call(this, 'modal')
}

StoreModal.prototype.putActive = function (data, done) {
    done(null, data)
}
