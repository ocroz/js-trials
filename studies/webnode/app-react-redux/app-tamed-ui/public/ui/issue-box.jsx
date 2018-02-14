'use strict'

/* globals Component, connect, Row, Col, Button, Form */
/* globals LinkView, DeleteIssue, CommentBox */
/* globals store, getIssues, openComment, closeComment, submitComment */

/* ******************** IssueBox ******************** */

class IssueBoxComp extends Component {
  componentWillMount () {
    const { dispatch } = this.props
    const issuekey = this.props.issuekey || this.props.match.params.key
    const issueIndex = store.getState().data.issues.findIndex(issue => issue.key === issuekey)
    if (issueIndex < 0) { dispatch(getIssues(dispatch)) }
  }

  render () {
    const container = this.props.issuekey ? 'container-fluid' : 'container'
    const issuekey = this.props.issuekey || this.props.match.params.key
    const issueIndex = store.getState().data.issues.findIndex(issue => issue.key === issuekey)
    const issue = store.getState().data.issues[issueIndex]
    const comments = issue && issue.fields.comment.comments
    const { isFetching, issues } = this.props.data
    const { isOpen } = this.props.comment
    return (
      <div>
        {isFetching && issues.length === 0 && <p><b>Loading...</b></p>}
        {!isFetching && issues.length === 0 && <p><b>Empty.</b></p>}
        {issues.length > 0 && issue !== undefined &&
        <div>
          <div className={container}>
            <Col lg={6}>
              Issue <LinkView view={`/issue/${issuekey}`}>{issuekey}</LinkView>
            </Col>
            <Col lg={6} className='text-right'>
              <DeleteIssue issuekey={issuekey}>Delete</DeleteIssue>
            </Col>
          </div>
          <div className={container}><hr /></div>
          <div className={container}>
            <b>Summary:</b>
            &nbsp;&nbsp;&nbsp;&nbsp;
            {issue.fields.summary}
            <p>{''}</p>
          </div>
          <div className={container}>
            <Row>
              <p>{''}</p>
              <Col lg={3} className='text-right'>
                <b>Type:</b><br />
                <b>Status:</b>
              </Col>
              <Col lg={2}>
                {issue.fields.issuetype.name}<br />
                {issue.fields.status.name}
              </Col>
              <Col lg={2} className='text-right'>
                <b>Assignee:</b><br />
                <b>Reporter:</b>
              </Col>
              <Col lg={2}>
                {issue.fields.assignee.name}<br />
                {issue.fields.reporter.name}
              </Col>
            </Row>
          </div>
          <div className={container}>
            <p>{''}</p>
            <p><b>Description:</b></p>
            <pre>{issue.fields.description}</pre><p>{''}</p>
          </div>
          <div className={container}><hr /></div>
          <div className={container}>
            {isFetching && comments.length === 0 && <p><b>Loading...</b></p>}
            {!isFetching && comments.length === 0 && <p><b>No comment yet</b></p>}
            {comments.length > 0 &&
              <div><b>Comments:</b><p>{''}</p>
                {comments.map(comment => <CommentBox issuekey={issue.key}>{comment}</CommentBox>)}
              </div>}
            <p>{''}</p>
            <Form onSubmit={this._handleSubmit.bind(this)} onBlur={this._handleBlur.bind(this)}>
              <textarea
                className='form-control' rows={1} placeholder='Add comment:' ref='comment'
                onFocus={this._handleFocus.bind(this)} />
              {isOpen && <Button bsStyle='primary' type='submit'>Submit</Button>}
            </Form>
          </div>
        </div>}
      </div>
    )
  }

  _closeComment () {
    this.refs.comment.value = ''
    this.refs.comment.rows = this.rows
    this.props.onBlur()
  }

  _handleFocus (event) {
    this.rows = event.target.rows
    event.target.rows = 3
    this.props.onFocus()
  }

  _handleBlur (event) {
    if (!event.relatedTarget || event.relatedTarget.type !== 'submit') {
      this._closeComment()
    }
  }

  _handleSubmit (event) {
    event.preventDefault()
    const issuekey = this.props.issuekey || this.props.match.params.key
    this.props.onSubmit(issuekey, this.refs.comment.value)
    this._closeComment()
  }
}

const mapIssueBox = {
  mapStateToProps: (state, ownProps) => { return { data: state.data, comment: state.comment } },
  mapDispatchToProps: (dispatch, ownProps) => {
    return {
      dispatch,
      onFocus: () => dispatch(openComment()),
      onBlur: () => dispatch(closeComment()),
      onSubmit: (issuekey, comment) => submitComment(dispatch, issuekey, comment)
    }
  }
}

const IssueBox = connect( // eslint-disable-line no-unused-vars
  mapIssueBox.mapStateToProps,
  mapIssueBox.mapDispatchToProps
)(IssueBoxComp)
