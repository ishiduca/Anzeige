var React = require('react')

var FormFilterColumn = module.exports = React.createClass({
    render: function () {
        return (
            <p className="control has-icon is-full" id="header">
                <input
                    className="input"
                    type="search"
                    placeholder="filter"
                    onChange={this.handleChange}
                />
                <i className="fa fa-search is-small"></i>
            </p>
        )
    }
  , handleChange: function (ev) {
        ev.preventDefault()
        var data = ev.target.value
        this.props.context.actWsMFilter.grep(data)
    }
})
