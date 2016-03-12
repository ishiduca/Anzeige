var inherits = require('inherits')
var Action   = require('flux-koime/action')

inherits(ActionWebsocketMessageFilter, Action)
module.exports = ActionWebsocketMessageFilter

function ActionWebsocketMessageFilter () {
    if (!(this instanceof ActionWebsocketMessageFilter))
        return new ActionWebsocketMessageFilter

    Action.call(this, 'timeline/filter', 'grep')
}

ActionWebsocketMessageFilter.prototype.grep = function (filterStr) {
    this.push(filterStr)
}
