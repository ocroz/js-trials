'use strict'

/* globals Component, Link, connect, moment, deleteComment */

/* ******************** CommentBox ******************** */

class CommentBoxComp extends Component {
  // componentDidMount () {
  //   const comment = this.props.children
  //   console.log(comment)
  // }

  render () {
    const comment = this.props.children
    return (
      <div>
        <i>
          Posted by {comment.author.name}{' '}
          <span title={moment(comment.created).format('YYYY/MM/DD HH:mm:ss')}>
            {moment(comment.created).fromNow()}</span>
          {/* new Date(comment.created).toISOString().substr(0, 19).replace(/-/g, '/').replace(/T/, ' ') */}
        </i>
        {' '}
        (<Link to={window.location.pathname} onClick={this._handleClick.bind(this)}>Delete</Link>)
        <br />
        <pre>{comment.body}</pre>
        <p>{''}</p>
      </div>
    )
  }

  _handleClick (event) {
    this.props.onDelete(this.props.issuekey, this.props.children.id)
  }
}

const mapCommentBox = {
  mapStateToProps: undefined,
  mapDispatchToProps: (dispatch, ownProps) => {
    return {
      onDelete: (issuekey, commentid) => deleteComment(dispatch, issuekey, commentid)
    }
  }
}

const CommentBox = connect( // eslint-disable-line no-unused-vars
  mapCommentBox.mapStateToProps,
  mapCommentBox.mapDispatchToProps
)(CommentBoxComp)
