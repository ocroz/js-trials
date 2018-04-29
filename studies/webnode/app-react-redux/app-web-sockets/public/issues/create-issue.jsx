'use strict'

/* globals Component, connect, Button, Form, Modal */
/* globals getIssues, openModal, closeModal, submitIssue, addFakeIssue */

/*
   The 3 ways to create an issue are:
   - CreateIssue -> CreateIssueModal
   - AddFakeIssue
   - CreateIssueForm
*/

/* ******************** CreateIssue ******************** */

const CreateIssueComp = ({ children, onClick }) => {
  return (
    <span>
      <button onClick={onClick}>{children}</button>
      <CreateIssueModal />
    </span>
  )
}

const mapCreateIssue = {
  mapStateToProps: (state, ownProps) => undefined,
  mapDispatchToProps: (dispatch, ownProps) => {
    return {
      onClick: () => dispatch(openModal())
    }
  }
}

const CreateIssue = connect( // eslint-disable-line no-unused-vars
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
      onSubmit: refs => {
        dispatch(closeModal())
        submitIssue(dispatch, refs)
      }
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
        dispatch(addFakeIssue(dispatch, () => dispatch(getIssues(dispatch))))
      }
    }
  }
}

const AddFakeIssue = connect( // eslint-disable-line no-unused-vars
  mapAddFakeIssue.mapStateToProps,
  mapAddFakeIssue.mapDispatchToProps
)(AddFakeIssueComp)

/* ******************** IssueForm ******************** */

class CreateIssueFormComp extends Component {
  render () {
    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>
          {this.props.children}
        </div>
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

const mapCreateIssueForm = {
  mapStateToProps: (state, ownProps) => undefined,
  mapDispatchToProps: (dispatch, ownProps) => {
    return {
      onSubmit: (refs) => submitIssue(dispatch, refs)
    }
  }
}

const CreateIssueForm = connect( // eslint-disable-line no-unused-vars
  mapCreateIssueForm.mapStateToProps,
  mapCreateIssueForm.mapDispatchToProps
)(CreateIssueFormComp)
