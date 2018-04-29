'use strict'

/* globals connect, Button */
/* globals cfRank, getIssues, deleteIssue */

/* ******************** IssuesListing ******************** */

const IssuesListingComp = ({isFetching, issues, onClick}) => (
  <div>
    {isFetching && issues.length === 0 && <p><b>Loading...</b></p>}
    {!isFetching && issues.length === 0 && <p><b>Empty.</b></p>}
    {issues.length > 0 &&
      <div style={{ opacity: isFetching ? 0.5 : 1 }}>
        Sorted by key:
        <ul>
          {issues.map((issue) =>
            <li>
              {issue.fields[cfRank]}
              {' - '}
              {issue.key}
              {': '}
              {issue.fields.summary}
              {' '}
              (<Button bsStyle='link' onClick={() => onClick(issue.key)}>Delete</Button>)
            </li>
          )}
        </ul>
      </div>
    }
  </div>
)

const mapIssuesListing = {
  mapStateToProps: (state, ownProps) => state.data,
  mapDispatchToProps: (dispatch, ownProps) => {
    return {
      onClick: (issuekey) => {
        dispatch(deleteIssue(dispatch, issuekey, () => dispatch(getIssues(dispatch))))
      }
    }
  }
}

const IssuesListing = connect( // eslint-disable-line no-unused-vars
  mapIssuesListing.mapStateToProps,
  mapIssuesListing.mapDispatchToProps
)(IssuesListingComp)
