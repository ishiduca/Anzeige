var xtend     = require('xtend')
var Twitter   = require('twitter')
module.exports = new Twitter(xtend(require('../../../configs/access_token'), require('../../../configs/consumer')))
