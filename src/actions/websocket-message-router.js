var stream = require('readable-stream')

module.exports = function (ws) {
    return function () {
        var actions = [].slice.apply(arguments)

        var wstream = new stream.Writable
        wstream._write = function (chnk, enc, done) {
            var data, label
            try {
                data  = JSON.parse(String(chnk))
                label = [data.service, data.timeline].join('@')
            } catch (err) {
                console.error(err)
                return done()
            }
            actions.forEach(function (act) {
                if (act.label === label) act.push(data.data)
            })
            done()
        }

        ws.pipe(wstream)
    }
}
