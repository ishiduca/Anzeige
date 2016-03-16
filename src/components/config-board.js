var React = require('react')
var empty = require('is-empty')

var ConfigBoard = module.exports = React.createClass({
    render: function () {
        var props  = this.props
        var config = props.configs.notification
        var keywords = this.state.keywords || config.keywords || ''
        return (
            <section
                id="config-board"
                className={empty(config.modal) ? 'modal' : 'modal is-active'}
            >
                <div className="modal-background"></div>
                <div className="modal-container">
                    <div className="modal-content">
                        <p className="control">
                            <label className="label">Notification config</label>
                            <textarea
                                className="textarea"
                                placeholder="write keywords"
                                value={keywords}
                                onChange={this.handleTextAreaChange}
                            >
                            </textarea>
                            <button
                                className="button is-primary"
                                onClick={this.handleSaveButtonClick}
                            >
                                save
                            </button>
                        </p>
                    </div>
                </div>
                <button
                    className="modal-close"
                    onClick={this.handleCloseButtonClick}
                ></button>
            </section>
        )
    }
  , getInitialState: function () {
        return {keywords: null}
    }
  , handleCloseButtonClick: function (ev) {
        this.props.context.actConfigBoardModal.close()
    }
  , handleSaveButtonClick: function (ev) {
        var keywords = this.state.keywords || this.props.configs.notification.keywords
        if (keywords) {
            console.log(keywords)
            this.props.context.actConfigBoardKeywords.save(keywords)
        }
        this.setState({keywords: null})
    }
  , handleTextAreaChange: function (ev) {
        var val = ev.target.value
        this.setState({keywords: val})
    }
})
