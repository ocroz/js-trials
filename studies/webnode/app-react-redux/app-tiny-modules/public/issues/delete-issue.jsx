'use strict'

/* globals connect, Link */
/* globals getIssues, deleteIssue, setView */

/* ******************** DeleteIssue ******************** */

const DeleteIssueComp = ({ children, onClick }) => (
  <Link to='/issues' onClick={onClick}>{children}</Link>
)

const mapDeleteIssue = {
  mapStateToProps: (state, ownProps) => { return { issuekey: ownProps.issuekey } },
  mapDispatchToProps: (dispatch, ownProps) => {
    return {
      onClick: () => {
        dispatch(deleteIssue(dispatch, ownProps.issuekey, () => dispatch(getIssues(dispatch))))
        dispatch(setView('/issues'))
      }
    }
  }
}

const DeleteIssue = connect( // eslint-disable-line no-unused-vars
  mapDeleteIssue.mapStateToProps,
  mapDeleteIssue.mapDispatchToProps
)(DeleteIssueComp)
