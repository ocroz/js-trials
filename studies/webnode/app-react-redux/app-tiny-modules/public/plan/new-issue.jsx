'use strict'

/* globals Component, connect, Form */
/* globals getIssues, submitIssue */

/* ******************** NewIssue ******************** */

class NewIssueComp extends Component {
  render () {
    return (
      <Form onSubmit={this._handleSubmit.bind(this)}>
        <input className='form-control' placeholder='New issue...' ref='summary' />
      </Form>
    )
  }

  _handleSubmit (event) {
    event.preventDefault()
    this.props.onSubmit(this.refs)
    this.refs.summary.value = ''
  }
}

const mapNewIssue = {
  mapStateToProps: (state, ownProps) => state.data,
  mapDispatchToProps: (dispatch, ownProps) => {
    return {
      onSubmit: (refs) => submitIssue(dispatch, refs, () => dispatch(getIssues(dispatch)))
    }
  }
}

const NewIssue = connect( // eslint-disable-line no-unused-vars
  mapNewIssue.mapStateToProps,
  mapNewIssue.mapDispatchToProps
)(NewIssueComp)
