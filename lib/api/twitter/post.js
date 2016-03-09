var client = require('./client')

module.exports = function ApiTwitterPost (help, params) {
    client.post('statuses/update', params, function (err, tweet) {
        if (err) help.error(err)
        else help.json(tweet)
    })
}
