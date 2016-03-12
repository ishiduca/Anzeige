var React = require('react')

var Columns = module.exports = React.createClass({
    render: function () {
        var props = this.props
        return (
            <div className="columns" id="columns">
                {Object.keys(props.columns).map(function (key) {
                    return (<Column
                                key={key}
                                label={key}
                                context={props.context}
                                column={props.columns[key]}
                            />)
                })}
            </div>
        )
    }
})

var MediaBox = require('./media-box')

var Column = React.createClass({
    render: function () {
        var props = this.props
        return (
            <div className="column">
                <h4>{props.label}</h4>
                {props.column.map(function (c) {
                    return (
                        <MediaBox
                            key={c.id}
                            context={props.context}
                            data={c.data}
                            meta={c.meta}
                            _data={c._data}
                        />
                    )
                })}
            </div>
        )
    }
})
