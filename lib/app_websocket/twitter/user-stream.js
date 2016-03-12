var crawler = require('timeline-stream/twitter-user-stream')
var client  = require('api/twitter/client')

var method = 'user'
var params = {}

module.exports = crawler(
    client
  , 'twitter'
  , 'user/stream'
  , {method: method, params}
)

