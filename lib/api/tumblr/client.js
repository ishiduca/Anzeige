var xtend  = require('xtend')
var tumblr = require('tumblr.js')
module.exports = new tumblr.Client(xtend(require('../../../configs/tumblr/access_token'), require('../../../configs/tumblr/consumer')))
