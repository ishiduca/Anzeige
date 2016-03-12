var twUserStream     = require('./twitter/user-stream')
var twListsPainters  = require('./twitter/lists-painters')
var tmbUserDashboard = require('./tumblr/user-dashboard')

var readables = [
    twUserStream.on('error', console.error.bind(console))
  , twListsPainters.on('error', console.error.bind(console))
  , tmbUserDashboard.on('error', console.error.bind(console))
]

module.exports = function handleWebsocketApp (ws) {
    readables.forEach(function (readable) {
        readable.pipe(ws)
        readable.get()
    })

    ws.socket.once('close', function () {
        readables.forEach(function (readable) {
            readable._readableState.pipes || readable.destroy()
        })
    })
    ws.socket.on('error', console.error.bind(console))

//    ws.once('unpipe', function () {
//        console.log('[.unpipe(websocketStream)]')
//    })
}
