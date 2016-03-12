var React = require('react')
var xtend = require('xtend')
var FormFilterColumn = require('./form-filter-column')
var Modal            = require('./modal')
var Columns          = require('./columns')
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
                <Modal
                    context={context}
                    data={this.state.modal}
                />
                <Columns
                    context={context}
                    columns={this.state.columns}
                />
                <FormTwitterPost context={context} />
            </section>
        )
    }
  , getInitialState: function () {
        return {
            columns: {
                all: []
            }
          , modal: null
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
    }
})
