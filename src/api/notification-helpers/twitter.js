module.exports = test

function test (data, keywords) {
    for (var i = 0, len = keywords.length; i < len; i++) {
        var keyword = keywords[i]
        var user = data.user || {}
        if ((user.screen_name || '').indexOf(keyword) !== -1) return createResult(data)
        if ((user.name || '').indexOf(keyword) !== -1) return createResult(data)
        if ((data.text || '').indexOf(keyword) !== -1) return createResult(data)
        if (data.retweeted_status) {
            var result = test(data.retweeted_status, keywords)
            if (result) return result
        }
    }

    function createResult (data) {
        return {
            title: (data.user || {}).screen_name
          , option: {
                body: data.text
              , icon: (data.user || {}).profile_image_url
            }
        }
    }
}
