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

        function mm (data) {
            return {
                id: data.id
              , date: new Date(data.created_at)
              , user: data.user || {}
              , link: ['https://twitter.com'
                      , (data.user || {}).screen_name, 'status', data.id_str].join('/')
              , text: data.text
              , nest: data.retweeted_status ? mm(data.retweeted_status) : null
              , media: (data.entities && data.entities.media)
                    ? data.entities.media.map(function (m) {
                        return {
                            media_url: m.media_url
                          , thumb_url: m.media_url + ':thumb'
                        }
                      })
                    : null
              , in_reply_to_status_id: data.id_str
            }
        }
    })
}
