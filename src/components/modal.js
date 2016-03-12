var React = require('react')

var FormFilterColumn = module.exports = React.createClass({
    render: function () {
        return (
            <div className={this.state.isActive ? 'modal is-active' : 'modal'}>
                <div className="modal-background"></div>
                <div className="modal-container">
                    <div className="modal-content">
                        hge
                    </div>
                </div>
                <button
                    className="modal-close"
                    onClick={this.hancleCloseButton}
                ></button>
            </div>
        )
    }
  , hancleCloseButton: function (ev) {
        this.setState({isActive: ! this.state.isActive})
   }
 , getInitialState: function () {
        return {isActive: false}
   }
})
