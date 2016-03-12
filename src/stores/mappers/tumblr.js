var parse = require('url-parse')

module.exports = function (me) {
    me.addEventListener('message', function (ev) {
        var data  = ev.data
        var list  = data[0]
        var label = data[1]

        me.postMessage(list.map(m))

        function m (data) {
            return {
                id: data.id
              , _data: data
              , data: mm(data)
              , meta: {
                    label: label
                }
            }
        }

        function mm (post) {
            return {
                id: post.id
              , user: {
                    screen_name: post.blog_name
                  , name: post.blog_name
                  , profile_image_url: ['https://api.tumblr.com/v2/blog'
                      , parse(post.post_url).hostname, 'avatar'].join('/')
                }
              , link: post.post_url
              , text: '[' + post.type + ']' + post.summary || post.slug || post.text || post.post_url
              , nest: null
              , media: (post.photos || []).map(function (photo) {
                    var url = ((photo.alt_sizes || []).filter(m)[0] || {}).url
                    return {
                        media_url: photo.original_size.url
                      , thumb_url: url
                    }
                    function m (opt) {return String(opt.width).slice(0, 1) === "2"}
              })
              , in_reply_to_status_id: null
            }
        }
    })
}
