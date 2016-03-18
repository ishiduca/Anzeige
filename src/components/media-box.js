var React    = require('react')
var timestmp = require('twitter-timeago')

var MediaBox = module.exports = React.createClass({
    render: function () {
        var props = this.props
        var data  = props.data

        return (
            <article className="media">
                <div className="media-left">
                    <img src={data.user.profile_image_url} />
                </div>
                <div className="media-content">
                    <div className="content">
                        <p>
                            <span style={{fontWeight: 'bold'}}>{data.user.screen_name}</span>&nbsp;
                            {
                                (data.user.screen_name !== data.user.name) &&
                                (<span className="is-small">{data.user.name}</span>)
                            }
                            <a href={data.link} target="_blank">
                                <i className="fa fa-external-link is-small"></i>
                            </a>&nbsp;
                            <a href="javascript:void(0)" onClick={this.handleModalClick}>
                                <i className="fa fa-paw is-small"></i>
                            </a>&nbsp;
                            {
                                (data.in_reply_to_status_id) &&
                                (<a href="javascript:void(0)" onClick={this.handleReplyClick}>
                                    <i className="fa fa-reply is-small"></i>
                                </a>)
                            }
                            <em className="is-small">{
                               " (" + timestmp(data.date) + ")"
                            }</em>
                        </p>
                        {(data.nest)
                            ? (
                                <MediaBox
                                    context={props.context}
                                    data={data.nest}
                                    meta={props.meta}
                                />
                              )
                            : (<p>{data.text}</p>)
                        }
                        {(! data.nest) && (writeImage(data.media))}
                    </div>
                </div>
            </article>
        )

        function writeImage (medias) {
            return (
                <div>
                    {(medias || []).filter(f).map(function (media) {
                        return (
                            <p key={media.media_url}>
                                <a href={media.media_url} target="_blank">
                                    <img src={media.thumb_url} />
                                </a>
                            </p>
                        )
                    })}
                </div>
            )
        }

        function f (media) {
            return /\.(jpg|jpeg|gif|png)/.test(media.media_url)
        }
    }
  , handleModalClick: function () {
        this.props.context.actModal.putActive(this.props.data)
    }
  , handleReplyClick: function () {
        this.props.context.actPrepareReply.prepare(this.props.data)
    }
})
