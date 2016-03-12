var inherits   = require('inherits')
var Action     = require('flux-koime/action')

inherits(ActionModal, Action)
module.exports = ActionModal

function ActionModal () {
    Action.call(this, 'modal', 'putActive')
}

ActionModal.prototype.putActive = function (data) {
    this.push(data)
}
