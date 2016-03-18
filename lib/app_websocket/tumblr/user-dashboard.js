var crawler = require('timeline-stream/crawler')
var client  = require('api/tumblr/client')
var debug   = require('debug')('tumblr@user/dashboard')

module.exports = crawler(
    client
  , 'tumblr'
  , 'user/dashboard'
  , {_get: _get, params: {}}
)

function _get (cb) {
    var me = this
    this.client.dashboard(this.parama, function (err, resp) {
        if (err) return cb(err)
        if (! resp) return cb()

        cb(null, resp.posts.filter(f))

        function f (post) {
            if (me.index.indexOf(post.id) !== -1) return false
debug('@%s >> %s', post.blog_name, post.slug || post.summary || post.text || post.caption)
            return !! me.index.push(post.id)
        }
    })
}
