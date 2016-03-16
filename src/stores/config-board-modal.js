var inherits = require('inherits')
var Store    = require('flux-koime/store')

inherits(StoreConfigBoardModal, Store)
module.exports = StoreConfigBoardModal

function StoreConfigBoardModal () {
    Store.call(this, 'configBoardModal')
}

StoreConfigBoardModal.prototype.close = function (flg, done) {
    done(null, flg)
}
