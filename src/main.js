var React    = require('react')
var ReactDOM = require('react-dom')
var Action   = require('flux-koime/action')
// api
var websocket = require('websocket-stream')
var parse     = require('url-parse')
var opt       = parse(location.href)
var ws        = websocket(['ws://', opt.host].join(''))
// vars
var TWITTER_USER_STREAM    = 'twitter@user/stream'
var TWITTER_LISTS_PAINTERS = 'twitter@lists/painters'
var TUMBLR_USER_DASHBOARD  = 'tumblr@user/dashboard'
var TIMELINE_FILTER        = 'timeline/filter'
var GET_LIST = 'getList'
// action
var actWsMTwitterUserStream     = new Action(TWITTER_USER_STREAM,    GET_LIST)
var actWsMTwitterListsPainters  = new Action(TWITTER_LISTS_PAINTERS, GET_LIST)
var actWsMTumblrUserDashboard   = new Action(TUMBLR_USER_DASHBOARD,  GET_LIST)
var actWsMFilter = new (require('./actions/websocket-message-filter'))

actWsMTwitterUserStream.push = function (_tweets) {
    var tweets = _tweets.filter(function (tweet) {
        return tweet.text && (tweet.user || {}).screen_name
    })
    if (tweets.length) Action.prototype.push.apply(this, [tweets])
}

// websocket routing
require('./actions/websocket-message-router')(ws)(
    actWsMTwitterUserStream
  , actWsMTwitterListsPainters
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
var storeWsMTumblrUserDashboard  = new StoreWebsocketMessage(TUMBLR_USER_DASHBOARD
                                     , work(workerTumblr), work(mapperTumblr))
var StoreWebsocketMessageCombine = require('./stores/websocket-message-combine')
var storeWsMCombine              = new StoreWebsocketMessageCombine(work(workerCombine))
var StoreWebsocketMessageFilter  = require('./stores/websocket-message-filter')
var storeWsMFilter               = new StoreWebsocketMessageFilter(work(workerFilter))

;[  storeWsMTwitterUserStream
  , storeWsMTwitterListsPainters
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
      , actWsMTumblrUserDashboard
      , actWsMFilter
    ]
  , stores: [
        storeWsMTwitterUserStream
      , storeWsMTwitterListsPainters
      , storeWsMTumblrUserDashboard
      , storeWsMFilter
    ]
})

var App = require('./components/app')

ReactDOM.render(<App context={{
    actWsMFilter: actWsMFilter
  , storeWsMFilter: storeWsMFilter
//,    storeWsMCombine: storeWsMCombine
//  , storeWsMTwitterUserStream: storeWsMTwitterUserStream
//  , storeWsMTwitterListsPainters: storeWsMTwitterListsPainters
//  , storeWsMTumblrUserDashboard: storeWsMTumblrUserDashboard
}} />, document.querySelector("#react-app"))
