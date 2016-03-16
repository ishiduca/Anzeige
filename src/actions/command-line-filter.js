module.exports = CommandLineFilter

function CommandLineFilter () {
    this.acts = [].slice.apply(arguments)
}

CommandLineFilter.prototype.dispatch = function (str) {
    for (var i = 0, len = this.acts.length; i < len; i++) {
        if (this.acts[i].test(str)) return this.acts[i].push(str)
    }
}
