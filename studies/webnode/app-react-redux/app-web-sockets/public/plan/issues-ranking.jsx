'use strict'

/* globals Component, connect, Button */
/* globals cfRank, rankIssues, getIssues */

/* ******************** IssuesRanking ******************** */

class IssuesRankingComp extends Component {
  render () {
    const { isFetching, issues, onUp, onDown } = this.props
    return (
      <div>
        {isFetching && issues.length === 0 && <p><b>Loading...</b></p>}
        {!isFetching && issues.length === 0 && <p><b>Empty.</b></p>}
        {issues.length > 0 &&
          <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            Sorted by rank:
            <ul>
              {issues
                .sort((a, b) => a.fields[cfRank] > b.fields[cfRank])
                .map((issue, i) =>
                  <li>
                    {issue.fields[cfRank]}
                    {' - '}
                    {issue.key}
                    {': '}
                    {issue.fields.summary}
                    {' '}
                    ({i > 0 && <Button bsStyle='link' onClick={() => onUp(issue.key, issues[i - 1].key)}>Up</Button>}
                    {i > 0 && i < issues.length - 1 && ', '}
                    {i < issues.length - 1 && <Button bsStyle='link' onClick={() => onDown(issue.key, issues[i + 1].key)}>Down</Button>})
                  </li>
                )
              }
            </ul>
          </div>
        }
      </div>
    )
  }
}

const mapIssuesRanking = {
  mapStateToProps: (state, ownProps) => state.data,
  mapDispatchToProps: (dispatch, ownProps) => {
    return {
      onUp: (issuekey, rankBeforeIssue) => {
        dispatch(rankIssues(dispatch, {issues: [issuekey], rankBeforeIssue}, () => dispatch(getIssues(dispatch))))
      },
      onDown: (rankBeforeIssue, issuekey) => {
        dispatch(rankIssues(dispatch, {issues: [issuekey], rankBeforeIssue}, () => dispatch(getIssues(dispatch))))
      }
    }
  }
}

const IssuesRanking = connect( // eslint-disable-line no-unused-vars
  mapIssuesRanking.mapStateToProps,
  mapIssuesRanking.mapDispatchToProps
)(IssuesRankingComp)
