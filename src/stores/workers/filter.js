module.exports = function (me) {
    me.addEventListener('message', function (ev) {
        var data      = ev.data
        var list      = data.list
        var filterStr = data.filterStr.toUpperCase()

        me.postMessage(list.filter(f))

        function f (_data) {
            var data = _data.data
            var meta = _data.meta

            return (
                meta.label.toUpperCase().indexOf(filterStr) !== -1 ||
                (data.user || {}).screen_name.toUpperCase().indexOf(filterStr) !== -1 ||
                (data.user || {}).name.toUpperCase().indexOf(filterStr) !== -1 ||
                (data.text || '').toUpperCase().indexOf(filterStr) !== -1 ||
                (data.nest && f({data: data.nest, meta: meta}))
            )
        }
    })
}
