var React = require('react')
var xtend = require('xtend')
var FormFilterColumn = require('./form-filter-column')
var Modal            = require('./modal')
var Columns          = require('./columns')
var ConfigBoard      = require('./config-board')
var FormTwitterPost  = require('./form-twitter-post')

//var ALL                    = 'all'
//var TWITTER_USER_STREAM    = 'twitter@user/stream'
//var TWITTER_LISTS_PAINTERS = 'twitter@lists/painters'
//var TUMBLR_USER_DASHBOARD  = 'tumblr@user/dashboard'

var App = module.exports = React.createClass({
    render: function () {
        var context = this.props.context
        return (
            <section>
                <FormFilterColumn context={context} />
                <ConfigBoard
                    context={context}
                    configs={this.state.configs}
                />
                <Modal
                    context={context}
                    data={this.state.modal}
                />
                <Columns
                    context={context}
                    columns={this.state.columns}
                />
                <FormTwitterPost
                    context={context}
                    reply={this.state.reply}
                />
            </section>
        )
    }
  , getInitialState: function () {
        return {
            columns: {
                all: []
            }
          , modal: null
          , reply: null
          , configs: {
                notification: {
                    keywords: ''
                  , modal: null
                }
            }
        }
    }
  , componentDidMount: function () {
        var me = this
        this.props.context.storeWsMFilter.filterStream.on('data', function (list) {
            me.state.columns.all = list
            me.setState(me.state)
        })
        this.props.context.storeModal.on('data', function (data) {
            me.setState({modal: data})
        })
        this.props.context.storePrepareReply.on('data', function (data) {
            me.setState({reply: data})
        })
        this.props.context.storeConfigBoardModal.on('data', function (flg) {
            var notification = xtend(me.state.configs.notification, {modal: flg})
            me.state.configs.notification = notification
            me.setState(me.state)
        })
        this.props.context.storeConfigBoardKeywords.on('data', function (keywords) {
            var notification = xtend(me.state.configs.notification, {keywords: keywords})
            me.state.configs.notification = notification
            me.setState(me.state)
        })
        this.props.context.actConfigBoardKeywords.gets()
    }
  , componentWillUnmount: function () {
        this.props.context.storeWsMFilter.filterStream.removeAllListeners()
        this.props.context.storeModal.removeAllListeners()
        this.props.context.storePrepareReply.removeAllListeners()
        this.props.context.storeConfigBoardModal.removeAllListeners()
        this.props.context.storeConfigBoardKeywords.removeAllListeners()
    }
})
