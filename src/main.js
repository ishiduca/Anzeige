var React    = require('react')
var ReactDOM = require('react-dom')
var Action   = require('flux-koime/action')
var parse    = require('url-parse')
var opt      = parse(location.href)
// vars
var WEB_SOCKET_URI             = ['ws://', opt.host].join('')
var URI_TWITTER_POST           = [opt.protocol, '//', opt.host, '/api/twitter/post'].join('')
var TWITTER_USER_STREAM        = 'twitter@user/stream'
var TWITTER_LISTS_PAINTERS     = 'twitter@lists/painters'
var TWITTER_LISTS_OTAEROCOM_AV = 'twitter@lists/otaerocom-av'
var TUMBLR_USER_DASHBOARD      = 'tumblr@user/dashboard'
var TIMELINE_FILTER            = 'timeline/filter'
var GET_LIST                   = 'getList'
var DB_NAME                    = 'Anzeige::configs'
var NOTIFICATION_KEYWORDS_KEY  = 'notification.keywords'
// api
var levelup   = require('levelup')
var db        = levelup(DB_NAME, {db: require('localstorage-down')})
var notifyHelperTwitter = require('./api/notification-helpers/twitter')
var notifyHelperTumblr  = require('./api/notification-helpers/tumblr')
var notify    = new (require('./api/notification'))({
                    twitter: {
                        'user/stream':        notifyHelperTwitter
                      , 'lists/painters':     notifyHelperTwitter
                      , 'lists/otaerocom-av': notifyHelperTwitter
                    }
                  , tumblr: {
                        'user/dashboard': notifyHelperTumblr
                    }
                })
var websocket = require('websocket-stream')
var ws        = websocket(WEB_SOCKET_URI)
// action
var actWsMTwitterUserStream     = new Action(TWITTER_USER_STREAM,    GET_LIST)
var actWsMTwitterListsPainters  = new Action(TWITTER_LISTS_PAINTERS, GET_LIST)
var actWsMTwitterListsOtaerocomAv = new Action(TWITTER_LISTS_OTAEROCOM_AV, GET_LIST)
var actWsMTumblrUserDashboard   = new Action(TUMBLR_USER_DASHBOARD,  GET_LIST)
var actWsMFilter                = new (require('./actions/websocket-message-filter'))
var actTwitterPost              = new (require('./actions/twitter-post'))(URI_TWITTER_POST)
var actModal                    = new (require('./actions/modal'))
var actPrepareReply             = new (require('./actions/prepare-reply'))
var actConfigBoardModal         = new (require('./actions/config-board-modal'))
var actConfigBoardKeywords      = new (require('./actions/config-board-keywords'))({
                                        db: db
                                      , key_name: NOTIFICATION_KEYWORDS_KEY
                                  })
var actCommandLineFilter        = new (require('./actions/command-line-filter'))(
                                      actConfigBoardModal  //
                                    , actWsMFilter         // actWsMFilter は引数の最後に指定
                                  )

actWsMTwitterUserStream.push = function (_tweets) {
    var tweets = _tweets.filter(function (tweet) {
        return tweet.text && (tweet.user || {}).screen_name
    })
    if (tweets.length) Action.prototype.push.apply(this, [tweets])
}
// notify setup
actConfigBoardKeywords.on('update', function (keywords) {
    notify.update(keywords)
})
ws.pipe(notify)
// websocket routing
require('./actions/websocket-message-router')(ws)(
    actWsMTwitterUserStream
  , actWsMTwitterListsPainters
  , actWsMTwitterListsOtaerocomAv
  , actWsMTumblrUserDashboard
)

// webworker for store
var work = require('webworkify')
var workerTwitter = require('./stores/workers/twitter')
var workerTumblr  = require('./stores/workers/tumblr')
var workerCombine = require('./stores/workers/combine')
var workerFilter  = require('./stores/workers/filter')
var mapperTwitter = require('./stores/mappers/twitter')
var mapperTumblr  = require('./stores/mappers/tumblr')
// store
var StoreWebsocketMessage        = require('./stores/websocket-message')
var storeWsMTwitterUserStream    = new StoreWebsocketMessage(TWITTER_USER_STREAM
                                     , work(workerTwitter), work(mapperTwitter))
var storeWsMTwitterListsPainters = new StoreWebsocketMessage(TWITTER_LISTS_PAINTERS
                                     , work(workerTwitter), work(mapperTwitter))
var storeWsMTwitterListsOtaerocomAv = new StoreWebsocketMessage(TWITTER_LISTS_OTAEROCOM_AV
                                     , work(workerTwitter), work(mapperTwitter))
var storeWsMTumblrUserDashboard  = new StoreWebsocketMessage(TUMBLR_USER_DASHBOARD
                                     , work(workerTumblr), work(mapperTumblr))
var StoreWebsocketMessageCombine = require('./stores/websocket-message-combine')
var storeWsMCombine              = new StoreWebsocketMessageCombine(work(workerCombine))
var StoreWebsocketMessageFilter  = require('./stores/websocket-message-filter')
var storeWsMFilter               = new StoreWebsocketMessageFilter(work(workerFilter))
var storeTwitterPost             = new (require('./stores/twitter-post'))
var storeModal                   = new (require('./stores/modal'))
var storePrepareReply            = new (require('./stores/prepare-reply'))
var storeConfigBoardModal        = new (require('./stores/config-board-modal'))
var storeConfigBoardKeywords     = new (require('./stores/config-board-keywords'))
// piped for stream merge
;[  storeWsMTwitterUserStream
  , storeWsMTwitterListsPainters
  , storeWsMTwitterListsOtaerocomAv
  , storeWsMTumblrUserDashboard
].forEach(function (store) {
    store.pipe(storeWsMCombine)
})
storeWsMCombine.pipe(storeWsMFilter.filterStream)

// connect pipe
require('flux-koime')({
    actions: [
        actWsMTwitterUserStream
      , actWsMTwitterListsPainters
      , actWsMTwitterListsOtaerocomAv
      , actWsMTumblrUserDashboard
      , actWsMFilter
      , actTwitterPost
      , actModal
      , actPrepareReply
      , actConfigBoardModal
      , actConfigBoardKeywords
    ]
  , stores: [
        storeWsMTwitterUserStream
      , storeWsMTwitterListsPainters
      , storeWsMTwitterListsOtaerocomAv
      , storeWsMTumblrUserDashboard
      , storeWsMFilter
      , storeTwitterPost
      , storeModal
      , storePrepareReply
      , storeConfigBoardModal
      , storeConfigBoardKeywords
    ]
})

var App = require('./components/app')

ReactDOM.render(<App context={{
/*    actWsMFilter: actWsMFilter
  , */
    actTwitterPost: actTwitterPost
  , actModal: actModal
  , actPrepareReply: actPrepareReply
  , actConfigBoardModal: actConfigBoardModal
  , actConfigBoardKeywords: actConfigBoardKeywords
  , actCommandLineFilter: actCommandLineFilter
  , storeWsMFilter: storeWsMFilter
  , storeTwitterPost: storeTwitterPost
  , storeModal: storeModal
  , storePrepareReply: storePrepareReply
  , storeConfigBoardModal: storeConfigBoardModal
  , storeConfigBoardKeywords: storeConfigBoardKeywords
//,    storeWsMCombine: storeWsMCombine
//  , storeWsMTwitterUserStream: storeWsMTwitterUserStream
//  , storeWsMTwitterListsPainters: storeWsMTwitterListsPainters
//  , storeWsMTumblrUserDashboard: storeWsMTumblrUserDashboard
}} />, document.querySelector("#react-app"))
