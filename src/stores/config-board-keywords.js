var inherits = require('inherits')
var xtend    = require('xtend')
var Store   = require('flux-koime/store')

inherits(StoreConfigBoardKeywords, Store)
module.exports = StoreConfigBoardKeywords

function StoreConfigBoardKeywords () {
    if (!(this instanceof StoreConfigBoardKeywords))
        return new StoreConfigBoardKeywords

    Store.call(this, 'configBoardKeywords')
}

StoreConfigBoardKeywords.prototype.getKeywords = function (keywords, done) {
    done(null, keywords)
}
