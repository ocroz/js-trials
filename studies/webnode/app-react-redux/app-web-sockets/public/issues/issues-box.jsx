'use strict'

/* globals Component, connect, Row, Col */
/* globals CreateIssue, AddFakeIssue, CreateIssueForm, DeleteIssue, IssueBox */
/* globals getIssues, setActiveIssue */

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
          <Col lg={4} md={4}>
            <div className='panel panel-default'>
              <div className='panel-body'>
                <p>
                  <CreateIssue>Create Issue</CreateIssue>
                  {' '}
                  <AddFakeIssue>Add Fake Issue</AddFakeIssue>
                </p>
                {isFetching && issues.length === 0 && <p><b>Loading...</b></p>}
                {!isFetching && issues.length === 0 && <p><b>Empty.</b></p>}
                {issues.length > 0 &&
                  <div style={{ opacity: isFetching ? 0.5 : 1 }}>
                    <ul>
                      {issues.map(issue => <Issue issuekey={issue.key}>{issue}</Issue>)}
                    </ul>
                  </div>
                }
                <CreateIssueForm>Create Issue Form</CreateIssueForm>
              </div>
            </div>
          </Col>
          <Col lg={8} md={8}>
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

const IssuesBox = connect( // eslint-disable-line no-unused-vars
  mapIssuesBox.mapStateToProps,
  mapIssuesBox.mapDispatchToProps
)(IssuesBoxComp)

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
