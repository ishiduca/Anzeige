var parse = require('url-parse')

module.exports = function (post, keywords) {
    for (var i = 0, len = keywords.length; i < len; i++) {
        var keyword = keywords[i]
        if (post.blog_name.indexOf(keyword) !== -1) return createResult(post)
        if ((post.title || '').indexOf(keyword) !== -1) return createResult(post)
        if ((post.body || '').indexOf(keyword) !== -1) return createResult(post)
        if ((post.text || '').indexOf(keyword) !== -1) return createResult(post)
        if ((post.slug || '').indexOf(keyword) !== -1) return createResult(post)
        if ((post.caption || '').indexOf(keyword) !== -1) return createResult(post)
    }

    function createResult (post) {
        return {
            title: post.blog_name
          , option: {
                body: post.body || post.text || post.slug || post.caption
              , icon: ['https://api.tumblr.com/v2/blog', parse(post.post_url).hostname, 'avatar'].join('/')
            }
          , link: post.post_url
        , link: post.post_url
      , link: post.post_url
    , link: post.post_url
        }
    }
}
