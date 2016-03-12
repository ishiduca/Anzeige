var React    = require('react')
var MediaBox = require('./media-box')

var FormFilterColumn = module.exports = React.createClass({
    render: function () {
        var props = this.props
        var context = props.context
        var exists  = props.data && props.data.id
        return (
            <div className={exists ? 'modal is-active' : 'modal'}>
                <div className="modal-background"></div>
                <div className="modal-container">
                    <div className="modal-content">
                        {
                            exists && (<MediaBox context={context} data={props.data} />)
                        }
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
        this.props.context.actModal.putActive({})
   }
})
