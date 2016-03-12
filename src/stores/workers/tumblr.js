var reduce = require('array-reduce')

module.exports = function (me) {
    me.addEventListener('message', function (ev) {
        var data    = ev.data
        var list    = data[0]
        var oldList = data[1]

        var index = reduce(oldList, function (index, data) {
            var id = data.id
            index[id] = id
            return index
        }, {})

        me.postMessage(list.filter(f).concat(oldList))

        function f (data) {
            return ! index[data.id]
        }
    })
}
