var React = require('react')

var FormTwitterPost = module.exports = React.createClass({
    render: function () {
        return (
            <div id="box-twitter-post">
                <div className="columns">
                    <div className="column">{this.state.in_reply_to_status_id || '--'}</div>
                    <div className="column is-1">{this.state.yourTweetLength}</div>
                </div>
                <form
                    onSubmit={this.handleSubmit}
                    className="control is-grouped is-full"
                >
                    <input
                        className="input"
                        type="text"
                        placeholder="what to tweet ?"
                        value={this.state.yourTweet}
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
        if ((this.state.tweet || {}).in_reply_to_status_id)
            params.in_reply_to_status_id = this.state.tweet.in_reply_to_status_id

        this.props.context.actTwitterPost.post(params)

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
    }
  , getInitialState: function () {
        return this._getInitialState()
    }
  , _getInitialState: function () {
        return {
            yourTweet: ''
          , disabled: true
          , in_reply_to_status_id: null
          , yourTweetLength: 0
        }
    }
})
