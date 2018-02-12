'use strict'
const { Component } = window.React
const { render } = window.ReactDOM
const { BrowserRouter, Route, Link, Switch, Redirect } = window.ReactRouterDOM
const { Provider, connect } = window.ReactRedux
const Modal = window.ReactBootstrap.Modal
const Form = window.ReactBootstrap.Form
const Row = window.ReactBootstrap.Row
const Col = window.ReactBootstrap.Col
const Button = window.ReactBootstrap.Button
const moment = window.moment

/* global store */
/* globals setView setActiveIssue openModal closeModal openComment closeComment */
/* globals getIssues addFakeIssue submitIssue deleteIssue submitComment deleteComment */

//
// React part - UI
//

/* ******************** Root, App, Header, Main, Home ******************** */

class Root extends Component {
  render () {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    )
  }
}

const App = () => (
  <div>
    <Header />
    <Main />
  </div>
)

const Header = () => {
  const matches = store.getState().view.match('/issue/([^/]*)')
  return (
    <div className='container'>
      <div className='page-header'>
        Goto:
        {' '}
        <LinkView view='/'>
          Home
        </LinkView>
        {', '}
        <LinkView view='/search'>
          Search
        </LinkView>
        {matches !== null &&
          <span>
            {', '}
            <LinkView view={matches[0]}>
              {matches[1]}
            </LinkView>
          </span>
        }
      </div>
    </div>
  )
}

const Main = () => (
  <div>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/search' component={IssuesBox} />
      <Route path='/issue/:key' component={IssueBox} />
      <Redirect to={store.getState().view} />
    </Switch>
  </div>
)

const Home = () => (
  <div className='container'>
    <p>Home</p>
  </div>
)

/* ******************** LinkView ******************** */

const LinkViewComp = ({ active, view, children, onClick }) => {
  if (active) {
    return <span>{children}</span>
  }

  return <Link to={view} onClick={onClick}>{children}</Link>
}

const mapLinkView = {
  mapStateToProps: (state, ownProps) => {
    return {
      active: ownProps.view === state.view,
      view: ownProps.view
    }
  },
  mapDispatchToProps: (dispatch, ownProps) => {
    return {
      onClick: () => {
        dispatch(setView(ownProps.view))
      }
    }
  }
}

const LinkView = connect(
  mapLinkView.mapStateToProps,
  mapLinkView.mapDispatchToProps
)(LinkViewComp)

/* ******************** IssuesBox ******************** */

class IssuesBoxComp extends Component {
  componentDidMount () {
    const { isFetching, dispatch } = this.props
    !isFetching && dispatch(getIssues(dispatch))
  }

  render () {
    const { isFetching, issues, activeIssue } = this.props
    return (
      <div className='container'>
        <Row>
          <Col lg={4}>
            <div className='panel panel-default'>
              <div className='panel-body'>
                <p>
                  <CreateIssue>Create Issue</CreateIssue>
                  {' '}
                  <AddFakeIssue>Add Fake Issue</AddFakeIssue>
                </p>
                <CreateIssueModal />
                {isFetching && issues.length === 0 && <p><b>Loading...</b></p>}
                {!isFetching && issues.length === 0 && <p><b>Empty.</b></p>}
                {issues.length > 0 &&
                  <div style={{ opacity: isFetching ? 0.5 : 1 }}>
                    <ul>
                      {issues.map(issue => <Issue issuekey={issue.key}>{issue}</Issue>)}
                    </ul>
                  </div>
                }
                <IssueForm />
              </div>
            </div>
          </Col>
          <Col lg={8}>
            {isFetching && issues.length === 0 && <p><b>Loading...</b></p>}
            {!isFetching && issues.length === 0 && <p><b>Empty.</b></p>}
            {issues.length > 0 && activeIssue !== null && <IssueBox issuekey={activeIssue} />}
          </Col>
        </Row>
      </div>
    )
  }
}

const mapIssuesBox = {
  mapStateToProps: (state, ownProps) => state.data,
  mapDispatchToProps: undefined
}

const IssuesBox = connect(
  mapIssuesBox.mapStateToProps,
  mapIssuesBox.mapDispatchToProps
)(IssuesBoxComp)

/* ******************** CreateIssue ******************** */

const CreateIssueComp = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>
}

const mapCreateIssue = {
  mapStateToProps: (state, ownProps) => undefined,
  mapDispatchToProps: (dispatch, ownProps) => {
    return {
      onClick: () => dispatch(openModal())
    }
  }
}

const CreateIssue = connect(
  mapCreateIssue.mapStateToProps,
  mapCreateIssue.mapDispatchToProps
)(CreateIssueComp)

/* ******************** CreateIssueModal ******************** */

class CreateIssueModalComp extends Component {
  constructor () {
    super()
    this.formRefs = {}
  }

  render () {
    const { isOpen } = this.props
    return (
      <Modal show={isOpen} onHide={this._handleClose.bind(this)}>
        <Form onSubmit={this._handleSubmit.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Create Issue Form</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input className='form-control' placeholder='Summary:' ref={input => (this.formRefs.summary = input)} required />
            <p>{''}</p>
            <textarea className='form-control' placeholder='Description:' ref={textarea => (this.formRefs.description = textarea)} required />
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle='link' onClick={this._handleClose.bind(this)}>Close</Button>
            <Button bsStyle='primary' type='submit'>Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }

  _handleClose (event) {
    event.preventDefault()
    this.props.onClose()
  }

  _handleSubmit (event) {
    event.preventDefault()
    this.props.onSubmit(this.formRefs)
  }
}

const mapCreateIssueModal = {
  mapStateToProps: (state, ownProps) => state.modal,
  mapDispatchToProps: (dispatch, ownProps) => {
    return {
      onClose: () => dispatch(closeModal()),
      onSubmit: (refs) => submitIssue(dispatch, refs)
    }
  }
}

const CreateIssueModal = connect(
  mapCreateIssueModal.mapStateToProps,
  mapCreateIssueModal.mapDispatchToProps
)(CreateIssueModalComp)

/* ******************** AddFakeIssue ******************** */

const AddFakeIssueComp = ({ children, onClick }) => (
  <button onClick={onClick}>{children}</button>
)

const mapAddFakeIssue = {
  mapStateToProps: (state, ownProps) => undefined,
  mapDispatchToProps: (dispatch, ownProps) => {
    return {
      onClick: () => {
        dispatch(addFakeIssue(dispatch, getIssues))
      }
    }
  }
}

const AddFakeIssue = connect(
  mapAddFakeIssue.mapStateToProps,
  mapAddFakeIssue.mapDispatchToProps
)(AddFakeIssueComp)

/* ******************** Issue ******************** */

const IssueComp = ({children: issue, onClick}) => (
  <div>
    <li>
      <button classType='button' className='btn btn-link' onClick={onClick}>{issue.key}</button>
      {': '}
      {issue.fields.summary}
      {' '}
      (<DeleteIssue issuekey={issue.key}>Delete</DeleteIssue>)
    </li>
  </div>
)

const mapIssue = {
  mapStateToProps: (state, ownProps) => { return { issuekey: ownProps.issuekey } },
  mapDispatchToProps: (dispatch, ownProps) => {
    return {
      onClick: () => {
        dispatch(setActiveIssue(ownProps.issuekey))
      }
    }
  }
}

const Issue = connect(
  mapIssue.mapStateToProps,
  mapIssue.mapDispatchToProps
)(IssueComp)

/* ******************** DeleteIssue ******************** */

const DeleteIssueComp = ({ children, onClick }) => (
  <Link to='/search' onClick={onClick}>{children}</Link>
)

const mapDeleteIssue = {
  mapStateToProps: (state, ownProps) => { return { issuekey: ownProps.issuekey } },
  mapDispatchToProps: (dispatch, ownProps) => {
    return {
      onClick: () => {
        dispatch(deleteIssue(dispatch, ownProps.issuekey, getIssues))
        dispatch(setView('/search'))
      }
    }
  }
}

const DeleteIssue = connect(
  mapDeleteIssue.mapStateToProps,
  mapDeleteIssue.mapDispatchToProps
)(DeleteIssueComp)

/* ******************** IssueForm ******************** */

class IssueFormComp extends Component {
  render () {
    return (
      <div className='panel panel-default'>
        <div className='panel-body'>
          <Form onSubmit={this._handleSubmit.bind(this)}>
            <input className='form-control' placeholder='Summary:' ref='summary' required />
            <p>{''}</p>
            <textarea className='form-control' placeholder='Description:' ref='description' required />
            <p>{''}</p>
            <Button bsStyle='primary' type='submit'>Submit</Button>
          </Form>
        </div>
      </div>
    )
  }

  _handleSubmit (event) {
    event.preventDefault()
    this.props.onSubmit(this.refs)
    Object.keys(this.refs).forEach(ref => { this.refs[ref].value = '' })
  }
}

const mapIssueForm = {
  mapStateToProps: (state, ownProps) => undefined,
  mapDispatchToProps: (dispatch, ownProps) => {
    return {
      onSubmit: (refs) => submitIssue(dispatch, refs)
    }
  }
}

const IssueForm = connect(
  mapIssueForm.mapStateToProps,
  mapIssueForm.mapDispatchToProps
)(IssueFormComp)

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
            <Row>
              <Col lg={2} className='text-right'><b>Summary:</b></Col>
              <Col lg={7}>{issue.fields.summary}</Col>
            </Row>
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
            <Row>
              <p>{''}</p>
              <Col lg={2} className='text-right'><b>Description:</b></Col>
              <Col lg={7}>{issue.fields.description}</Col><p>{''}</p>
            </Row>
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

const IssueBox = connect(
  mapIssueBox.mapStateToProps,
  mapIssueBox.mapDispatchToProps
)(IssueBoxComp)

/* ******************** CommentBox ******************** */

class CommentBoxComp extends Component {
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
        {comment.body}
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

const CommentBox = connect(
  mapCommentBox.mapStateToProps,
  mapCommentBox.mapDispatchToProps
)(CommentBoxComp)

/* ******************** render ******************** */

render(
  <Root />,
  document.getElementById('root')
)
