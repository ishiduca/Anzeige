var inherits   = require('inherits')
var Action     = require('flux-koime/action')

var COMMAND = ':config'

inherits(ActionConfigBoardModal, Action)
module.exports = ActionConfigBoardModal

function ActionConfigBoardModal () {
    Action.call(this, 'configBoardModal', 'close')
}

ActionConfigBoardModal.prototype.test = function (str) {
    return (str || '').trim() === COMMAND
}

ActionConfigBoardModal.prototype.close = function () {
    this.push({})
}
