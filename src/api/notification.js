var stream   = require('readable-stream')
var inherits = require('inherits')
var xtend    = require('xtend')

var GRANTED = 'granted'
var DENIED  = 'denied'

inherits(NotificationStream, stream.Writable)
module.exports = NotificationStream

function NotificationStream (_opt) {
    if (!(this instanceof NotificationStream))
        return new NotificationStream(_opt)

    stream.Writable.call(this)

    this.keywords = []
    this.opt      = xtend(_opt)
}

NotificationStream.prototype.update = function (keywords) {
    this.keywords = (keywords || '').split('\n').filter(f)
    function f (str) {return !! str.trim().length}
}

NotificationStream.prototype._write = function (buf, enc, done) {
    done()

    var datas
    try {
        datas    = JSON.parse(String(buf))
    } catch (err) {
        console.error(err)
    }

    var me = this
    var service  = datas.service
    var timeline = datas.timeline
    var list     = datas.data

    if (this.opt[service] && this.opt[service][timeline]) {
        var test = this.opt[service][timeline]
        list.forEach(function (data) {
            var result = test(data, me.keywords)
            if (result) {
                me.notif(result.title, result.option, function (err, notify) {
                    err && console.error(err)
                })
            }
        })
    }
}

NotificationStream.prototype.notif = function (title, opt, f) {
    if (!('Notification' in window))
        return f(new Error('can not use window.Notification'))

    if (Notification.permission === GRANTED)
        return f(null, new Notification(title, opt))

    if (Notification.permission !== DENIED) {
        return Notification.requestPermission(function (permission) {
            if (permission === GRANTED)
                return f(null, new Notification(title, opt))
            f(new Error('Permission!'))
        })
    }

    f(new Error('something error'))
}
