var crawler = require('timeline-stream/crawler')
var client  = require('api/twitter/client')
var debug   = require('debug')('twitter@lists/otaerocom-av')

var params = {
    slug: 'av'
  , owner_screen_name: 'otaerocom'
}

var method = 'lists/statuses'
var interval = 1000 * 60 * 5

module.exports = crawler(
    client
  , 'twitter'
  , 'lists/otaerocom-av'
  , {
        _get: _get
      , method: method
      , params: params
      , interval: interval
    }
)

function _get (cb) {
    var me = this
    this.client.get(this.method, this.params, function (err, tweets) {
        if (err) return cb(err)
        if (! tweets) return cb()

        cb(null, tweets.filter(f))

        function f (tweet) {
            if (me.index.indexOf(tweet.id) !== -1) return false
tweet.user && debug('@%s >> %s', tweet.user.screen_name, tweet.text)
            return !! me.index.push(tweet.id)
        }
    })
}
