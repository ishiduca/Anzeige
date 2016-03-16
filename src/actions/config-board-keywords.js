var inherits = require('inherits')
var xtend    = require('xtend')
var Action   = require('flux-koime/action')

inherits(ActionConfigBoardKeywords, Action)
module.exports = ActionConfigBoardKeywords

function ActionConfigBoardKeywords (_opt) {
    if (!(this instanceof ActionConfigBoardKeywords))
        return new ActionConfigBoardKeywords(_opt)
    Action.call(this, 'configBoardKeywords', 'getKeywords')
    var me  = this
    var opt = xtend(_opt)
    Object.keys(opt).forEach(function (key) {
        me[key] = opt[key]
    })
}

ActionConfigBoardKeywords.prototype.save = function (keywords) {
    var me = this
    this.db.put(this.key_name, keywords, function (err) {
        ;(err) ? console.error(err) : me.gets()
    })
}

ActionConfigBoardKeywords.prototype.gets = function () {
    var me = this
    this.db.get(this.key_name, function (err, keywords) {
        if (err && err.type !== 'NotFoundError') return console.error(err)
        me.push(keywords)
        me.emit('update', keywords)
    })
}
