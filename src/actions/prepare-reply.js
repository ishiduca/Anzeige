var inherits   = require('inherits')
var Action     = require('flux-koime/action')

inherits(ActionPrepareReply, Action)
module.exports = ActionPrepareReply

function ActionPrepareReply () {
    Action.call(this, 'prepareReply', 'prepare')
}

ActionPrepareReply.prototype.prepare = function (data) {
    this.push(data)
}
