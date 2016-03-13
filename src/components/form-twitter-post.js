var React = require('react')

var FormTwitterPost = module.exports = React.createClass({
    render: function () {
        var props = this.props
        var reply = props.reply || {}
        var screen_name = (reply.user || {}).screen_name ? '@' + reply.user.screen_name : ''
        var yourTweet = this.state.yourTweet || screen_name || ''
        var yourTweetLength = yourTweet.length
        return (
            <div id="box-twitter-post">
                <div className="columns">
                    <div className="column">{(reply || {}).in_reply_to_status_id || '--'}</div>
                    <div className="column is-1">{yourTweetLength}</div>
                </div>
                <form
                    onSubmit={this.handleSubmit}
                    className="control is-grouped is-full"
                >
                    <input
                        className="input"
                        type="text"
                        placeholder="what to tweet ?"
                        value={yourTweet}
                        onChange={this.handleChange}
                    />
                    <button
                        className="button is-primary"
                        type="submit"
                        disabled={this.state.disabled ? 'disabled' : ''}
                    ><i className="fa fa-twitter is-small"></i></button>
                    <button
                        className="button"
                        onClick={this.handleResetButton}
                        type="reset"
                    >clear</button>
                </form>
            </div>
        )
    }
  , handleSubmit: function (ev) {
        ev.preventDefault()
        var val = this.state.yourTweet.trim()
        var params = {'status': val}
        if ((this.props.reply || {}).in_reply_to_status_id)
            params.in_reply_to_status_id = this.props.reply.in_reply_to_status_id

        this.props.context.actTwitterPost.post(params)
        this.props.context.actPrepareReply.prepare({})

        this.setState(this._getInitialState())
    }
  , handleChange: function (ev) {
        var val = ev.target.value
        var len = val.trim().length
        var disabled = !(len > 0 && len < 140)

        this.setState({
            yourTweet: val
          , yourTweetLength: len
          , disabled: disabled
        })
    }
  , handleResetButton: function () {
        this.setState(this._getInitialState())
        this.props.context.actPrepareReply.prepare({})
    }
  , getInitialState: function () {
        return this._getInitialState()
    }
  , _getInitialState: function () {
        return {
            yourTweet: ''
          , disabled: true
          , yourTweetLength: 0
        }
    }
})
